import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportExportService } from '../../services/import-export.service';
import { ExportJob, ImportResult } from '../../models/job.model';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-export.html',
  styleUrl: './import-export.scss'
})
export class ImportExportComponent implements OnDestroy {
  exportFormat: 'pdf' | 'json' = 'json';
  exportJob: ExportJob | null = null;
  exportProgress: number = 0;
  isExporting: boolean = false;
  
  importFile: File | null = null;
  importResult: ImportResult | null = null;
  isImporting: boolean = false;
  importProgress: number = 0;

  private pollInterval: any;

  constructor(private importExportService: ImportExportService) {}

  startExport(): void {
    this.isExporting = true;
    this.exportProgress = 0;
    this.exportJob = null;

    this.importExportService.startExport(this.exportFormat).subscribe({
      next: (job) => {
        this.exportJob = job;
        this.pollExportStatus(job.id);
      },
      error: (error) => {
        console.error('Error starting export:', error);
        this.isExporting = false;
      }
    });
  }

  pollExportStatus(jobId: string): void {
    this.pollInterval = setInterval(() => {
      this.importExportService.getExportJobStatus(jobId).subscribe({
        next: (job) => {
          this.exportJob = job;
          this.exportProgress = job.progress;

          if (job.status === 'completed') {
            clearInterval(this.pollInterval);
            this.downloadExport(jobId);
            this.isExporting = false;
          } else if (job.status === 'failed') {
            clearInterval(this.pollInterval);
            this.isExporting = false;
            alert('Export failed. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error polling export status:', error);
          clearInterval(this.pollInterval);
          this.isExporting = false;
        }
      });
    }, 1000);
  }

  downloadExport(jobId: string): void {
    this.importExportService.downloadExport(jobId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes-export-${Date.now()}.${this.exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading export:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.importFile = input.files[0];
    }
  }

  startImport(): void {
    if (!this.importFile) {
      alert('Please select a file to import');
      return;
    }

    this.isImporting = true;
    this.importProgress = 0;
    this.importResult = null;

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.importProgress < 90) {
        this.importProgress += 10;
      }
    }, 200);

    this.importExportService.uploadImport(this.importFile).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.importProgress = 100;
        this.importResult = result;
        this.isImporting = false;
      },
      error: (error) => {
        clearInterval(progressInterval);
        console.error('Error importing:', error);
        this.isImporting = false;
        alert('Import failed. Please check the file format.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }
}

