import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notes-list.html',
  styleUrl: './notes-list.scss'
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm: string = '';
  selectedTags: string[] = [];
  allTags: string[] = [];
  sortBy: string = 'lastModified';

  constructor(
    private notesService: NotesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadTags();
  }

  loadNotes(): void {
    this.notesService.getNotes(
      this.searchTerm || undefined,
      this.selectedTags.length > 0 ? this.selectedTags : undefined,
      this.sortBy
    ).subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filteredNotes = notes;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
      }
    });
  }

  loadTags(): void {
    this.notesService.getAllTags().subscribe({
      next: (tags) => {
        this.allTags = tags;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
      }
    });
  }

  onSearchChange(search: string): void {
    this.searchTerm = search;
    this.loadNotes();
  }

  onTagToggle(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.loadNotes();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.loadNotes();
  }

  createNote(): void {
    this.router.navigate(['/notes/new']);
  }

  editNote(id: string): void {
    this.router.navigate(['/notes', id]);
  }

  getPreview(body: string): string {
    return body.length > 100 ? body.substring(0, 100) + '...' : body;
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
}
