import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, NoteCreate, NoteUpdate } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://localhost:3000/api/notes';

  constructor(private http: HttpClient) {}

  getNotes(search?: string, tags?: string[], sortBy?: string): Observable<Note[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (tags && tags.length > 0) {
      params = params.set('tags', tags.join(','));
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    return this.http.get<Note[]>(this.apiUrl, { params });
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  createNote(note: NoteCreate): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  updateNote(id: string, note: NoteUpdate): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tags`);
  }
}
