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

  it('should get notes', () => {
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

    const req = httpMock.expectOne('http://localhost:3000/api/notes');
    expect(req.request.method).toBe('GET');
    req.flush(mockNotes);
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
