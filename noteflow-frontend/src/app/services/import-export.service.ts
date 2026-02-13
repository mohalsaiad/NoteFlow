import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportJob, ImportResult } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  startExport(format: 'pdf' | 'json'): Observable<ExportJob> {
    return this.http.post<ExportJob>(`${this.apiUrl}/export`, { format });
  }

  getExportJobStatus(jobId: string): Observable<ExportJob> {
    return this.http.get<ExportJob>(`${this.apiUrl}/jobs/${jobId}`);
  }

  downloadExport(jobId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/${jobId}`, {
      responseType: 'blob'
    });
  }

  uploadImport(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.apiUrl}/import`, formData);
  }
}
