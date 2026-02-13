const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Storage for data
// Persisted: users, notes
// In-memory: exportJobs (short-lived)
let users = [];
let notes = [];
let exportJobs = {};

// ---- Persistence (JSON file storage) ----
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(USERS_FILE); } catch { await fs.writeFile(USERS_FILE, '[]', 'utf8'); }
  try { await fs.access(NOTES_FILE); } catch { await fs.writeFile(NOTES_FILE, '[]', 'utf8'); }
}

async function atomicWriteJson(filePath, data) {
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmpPath, filePath);
}

async function loadData() {
  await ensureDataFiles();
  const [usersRaw, notesRaw] = await Promise.all([
    fs.readFile(USERS_FILE, 'utf8'),
    fs.readFile(NOTES_FILE, 'utf8')
  ]);

  try { users = JSON.parse(usersRaw); } catch { users = []; }
  try { notes = JSON.parse(notesRaw); } catch { notes = []; }

  if (!Array.isArray(users)) users = [];
  if (!Array.isArray(notes)) notes = [];
}

async function saveUsers() {
  await atomicWriteJson(USERS_FILE, users);
}

async function saveNotes() {
  await atomicWriteJson(NOTES_FILE, notes);
}

// Initialize persisted data and ensure default admin user exists
(async () => {
  await loadData();

  const hasAdmin = users.some(u => u.username === 'admin');
  if (!hasAdmin) {
    const hashedPassword = await bcrypt.hash('password', 10);
    users.push({
      id: '1',
      username: 'admin',
      password: hashedPassword
    });
    await saveUsers();
  }

  console.log('Data loaded:', { users: users.length, notes: notes.length });
})().catch(err => {
  console.error('Failed to initialize data:', err);
});

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// -------------------- Auth Routes --------------------
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username: username,
    password: hashedPassword
  };

  users.push(newUser);
  await saveUsers();

  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username
    }
  });
});

// -------------------- Notes Routes --------------------
app.get('/api/notes', authenticateToken, (req, res) => {
  let userNotes = notes.filter(n => n.userId === req.user.id);

  // Search
  if (req.query.search) {
    const search = String(req.query.search).toLowerCase();
    userNotes = userNotes.filter(n =>
        (n.title || '').toLowerCase().includes(search) ||
        (n.body || '').toLowerCase().includes(search)
    );
  }

  // Filter by tags
  if (req.query.tags) {
    const filterTags = String(req.query.tags).split(',').map(t => t.trim()).filter(Boolean);
    userNotes = userNotes.filter(n =>
        filterTags.some(tag => (n.tags || []).includes(tag))
    );
  }

  // Sort
  if (req.query.sortBy === 'created') {
    userNotes.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (req.query.sortBy === 'title') {
    userNotes.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else {
    // Default: lastModified
    userNotes.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  }

  res.json(userNotes);
});

app.get('/api/notes/tags', authenticateToken, (req, res) => {
  const userNotes = notes.filter(n => n.userId === req.user.id);
  const allTags = new Set();
  userNotes.forEach(note => {
    (note.tags || []).forEach(tag => allTags.add(tag));
  });
  res.json(Array.from(allTags));
});

app.get('/api/notes/:id', authenticateToken, (req, res) => {
  const note = notes.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

app.post('/api/notes', authenticateToken, (req, res) => {
  const { title, body, tags } = req.body;
  const now = new Date();

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required' });
  }

  const note = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    body,
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
    created: now,
    lastModified: now
  };

  notes.push(note);
  saveNotes().catch(console.error);

  res.status(201).json(note);
});

app.put('/api/notes/:id', authenticateToken, (req, res) => {
  const noteIndex = notes.findIndex(
      n => n.id === req.params.id && n.userId === req.user.id
  );

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const note = notes[noteIndex];
  const { title, body, tags } = req.body;

  if (title !== undefined) {
    if (!title) return res.status(400).json({ message: 'Title cannot be empty' });
    note.title = title;
  }

  if (body !== undefined) {
    if (!body) return res.status(400).json({ message: 'Body cannot be empty' });
    note.body = body;
  }

  if (tags !== undefined) {
    note.tags = Array.isArray(tags) ? tags : (tags ? [tags] : []);
  }

  note.lastModified = new Date();
  notes[noteIndex] = note;

  saveNotes().catch(console.error);

  res.json(note);
});

app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  const noteIndex = notes.findIndex(
      n => n.id === req.params.id && n.userId === req.user.id
  );

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  saveNotes().catch(console.error);

  res.sendStatus(204);
});

// -------------------- Export Routes --------------------
app.post('/api/export', authenticateToken, (req, res) => {
  const { format } = req.body;
  const jobId = uuidv4();

  const job = {
    id: jobId,
    userId: req.user.id,
    status: 'pending',
    progress: 0,
    format: format || 'json',
    createdAt: new Date()
  };

  exportJobs[jobId] = job;

  // Simulate async export processing
  setTimeout(() => {
    processExport(jobId);
  }, 100);

  res.status(202).json(job);
});

app.get('/api/jobs/:id', authenticateToken, (req, res) => {
  const job = exportJobs[req.params.id];
  if (!job || job.userId !== req.user.id) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
});

app.get('/api/export/:id', authenticateToken, (req, res) => {
  const job = exportJobs[req.params.id];
  if (!job || job.userId !== req.user.id) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.status !== 'completed') {
    return res.status(400).json({ message: 'Export not completed' });
  }

  const userNotes = notes.filter(n => n.userId === req.user.id);

  if (job.format === 'json') {
    const content = JSON.stringify(userNotes, null, 2);
    const filename = 'notes-export.json';
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    return res.send(content);
  }

  // PDF export via pdfkit
  const filename = 'notes-export.pdf';
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/pdf');

  try {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('NoteFlow Export', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`Exported on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.fontSize(10).text(`Total Notes: ${userNotes.length}`, { align: 'center' });
    doc.moveDown(2);

    if (userNotes.length === 0) {
      doc.fontSize(14).text('No notes to export.', { align: 'center' });
    } else {
      userNotes.forEach((note, index) => {
        if (index > 0) doc.addPage();

        doc.fontSize(16).font('Helvetica-Bold')
            .text(note.title || 'Untitled Note', { underline: true });
        doc.moveDown(0.5);

        const bodyText = note.body || '(No content)';
        doc.fontSize(12).font('Helvetica').text(bodyText, {
          align: 'left',
          width: doc.page.width - 100
        });
        doc.moveDown();

        if (note.tags && note.tags.length > 0) {
          doc.fontSize(10).font('Helvetica-Oblique')
              .text(`Tags: ${note.tags.join(', ')}`);
          doc.moveDown();
        }

        const createdDate = note.created ? new Date(note.created).toLocaleString() : 'Unknown';
        const modifiedDate = note.lastModified ? new Date(note.lastModified).toLocaleString() : 'Unknown';
        doc.fontSize(10).font('Helvetica').text(`Created: ${createdDate}`);
        doc.text(`Modified: ${modifiedDate}`);
      });
    }

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF file' });
  }
});

function processExport(jobId) {
  const job = exportJobs[jobId];
  if (!job) return;

  job.status = 'processing';
  job.progress = 10;

  const interval = setInterval(() => {
    job.progress += 10;
    if (job.progress >= 100) {
      job.progress = 100;
      job.status = 'completed';
      clearInterval(interval);
    }
  }, 200);
}

// -------------------- Import Routes --------------------
app.post('/api/import', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadedPath = req.file.path;

  try {
    const fileContent = await fs.readFile(uploadedPath, 'utf8');
    const importedNotes = JSON.parse(fileContent);

    if (!Array.isArray(importedNotes)) {
      return res.status(400).json({ message: 'Invalid file format: expected an array of notes' });
    }

    let created = 0;
    let rejected = 0;
    const errors = [];

    importedNotes.forEach((note, index) => {
      if (!note || !note.title || !note.body) {
        rejected++;
        errors.push(`Note at index ${index}: Missing required fields (title/body)`);
        return;
      }

      const newNote = {
        id: uuidv4(),
        userId: req.user.id,
        title: note.title,
        body: note.body,
        tags: Array.isArray(note.tags) ? note.tags : (note.tags ? [note.tags] : []),
        created: new Date(),
        lastModified: new Date()
      };

      notes.push(newNote);
      created++;
    });

    await saveNotes();

    res.json({
      created,
      rejected,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid JSON file', error: error.message });
  } finally {
    // Always clean up uploaded file
    try { await fs.unlink(uploadedPath); } catch { /* ignore */ }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`NoteFlow backend server running on http://localhost:${PORT}`);
});
