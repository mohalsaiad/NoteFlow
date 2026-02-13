import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotesService } from './notes.service';
import { Note } from '../models/note.model';

describe('NotesService', () => {
  let service: NotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotesService]
    });
    service = TestBed.inject(NotesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get notes (no query params)', () => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Test Note',
        body: 'Test body',
        tags: ['test'],
        created: new Date(),
        lastModified: new Date()
      }
    ];

    service.getNotes().subscribe(notes => {
      expect(notes).toEqual(mockNotes);
    });

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    // no params set
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockNotes);
  });

  // ✅ covers: if (search) branch true
  it('should get notes with search param', () => {
    service.getNotes('hello').subscribe();

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('hello');

    req.flush([]);
  });

  // ✅ covers: if (tags && tags.length > 0) branch true
  it('should get notes with tags param', () => {
    service.getNotes(undefined, ['tag1', 'tag2']).subscribe();

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('tags')).toBe('tag1,tag2');

    req.flush([]);
  });

  // ✅ covers: if (sortBy) branch true
  it('should get notes with sortBy param', () => {
    service.getNotes(undefined, undefined, 'title').subscribe();

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('sortBy')).toBe('title');

    req.flush([]);
  });

  // ✅ extra: covers tags branch false when tags provided but empty (helps branch counting)
  it('should NOT set tags param when tags array is empty', () => {
    service.getNotes(undefined, []).subscribe();

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('tags')).toBeFalse();

    req.flush([]);
  });

  it('should get note by id', () => {
    const mockNote: Note = {
      id: '1',
      title: 'Test Note',
      body: 'Test body',
      tags: ['test'],
      created: new Date(),
      lastModified: new Date()
    };

    service.getNote('1').subscribe(note => {
      expect(note).toEqual(mockNote);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/notes/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockNote);
  });

  it('should create note', () => {
    const newNote = {
      title: 'New Note',
      body: 'New body',
      tags: ['new']
    };

    const mockResponse: Note = {
      id: '2',
      ...newNote,
      created: new Date(),
      lastModified: new Date()
    };

    service.createNote(newNote).subscribe(note => {
      expect(note).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/notes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newNote);
    req.flush(mockResponse);
  });

  it('should update note', () => {
    const update = { title: 'Updated Title' };
    const mockResponse: Note = {
      id: '1',
      title: 'Updated Title',
      body: 'Test body',
      tags: ['test'],
      created: new Date(),
      lastModified: new Date()
    };

    service.updateNote('1', update).subscribe(note => {
      expect(note.title).toBe('Updated Title');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/notes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush(mockResponse);
  });

  it('should delete note', () => {
    service.deleteNote('1').subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/notes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get all tags', () => {
    const mockTags = ['tag1', 'tag2', 'tag3'];

    service.getAllTags().subscribe(tags => {
      expect(tags).toEqual(mockTags);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/notes/tags');
    expect(req.request.method).toBe('GET');
    req.flush(mockTags);
  });
});
