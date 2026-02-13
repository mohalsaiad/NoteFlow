export interface Note {
  id?: string;
  title: string;
  body: string;
  tags: string[];
  lastModified: Date;
  created: Date;
}

export interface NoteCreate {
  title: string;
  body: string;
  tags: string[];
}

export interface NoteUpdate {
  title?: string;
  body?: string;
  tags?: string[];
}
