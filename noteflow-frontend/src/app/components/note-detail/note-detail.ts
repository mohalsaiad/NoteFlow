import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { Note, NoteUpdate } from '../../models/note.model';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-detail.html',
  styleUrl: './note-detail.scss'
})
export class NoteDetailComponent implements OnInit {
  noteForm: FormGroup;
  noteId: string | null = null;
  isNewNote: boolean = false;
  showDeleteConfirm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      tags: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewNote = true;
    } else {
      this.noteId = id;
      this.loadNote();
    }
  }

  loadNote(): void {
    if (this.noteId) {
      this.notesService.getNote(this.noteId).subscribe({
        next: (note) => {
          this.noteForm.patchValue({
            title: note.title,
            body: note.body,
            tags: note.tags.join(', ')
          });
        },
        error: (error) => {
          console.error('Error loading note:', error);
          this.router.navigate(['/notes']);
        }
      });
    }
  }

  saveNote(): void {
    if (this.noteForm.valid) {
      const formValue = this.noteForm.value;
      const tags = formValue.tags
        ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [];

      if (this.isNewNote) {
        this.notesService.createNote({
          title: formValue.title,
          body: formValue.body,
          tags
        }).subscribe({
          next: () => {
            this.router.navigate(['/notes']);
          },
          error: (error) => {
            console.error('Error creating note:', error);
          }
        });
      } else if (this.noteId) {
        const update: NoteUpdate = {
          title: formValue.title,
          body: formValue.body,
          tags
        };
        this.notesService.updateNote(this.noteId, update).subscribe({
          next: () => {
            this.router.navigate(['/notes']);
          },
          error: (error) => {
            console.error('Error updating note:', error);
          }
        });
      }
    }
  }

  deleteNote(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.noteId) {
      this.notesService.deleteNote(this.noteId).subscribe({
        next: () => {
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          console.error('Error deleting note:', error);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancel(): void {
    this.router.navigate(['/notes']);
  }
}
