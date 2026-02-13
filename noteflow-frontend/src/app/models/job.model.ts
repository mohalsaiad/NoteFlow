export interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  format: 'pdf' | 'json';
  createdAt: Date;
}

export interface ImportResult {
  created: number;
  rejected: number;
  errors?: string[];
}
