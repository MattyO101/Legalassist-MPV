export interface Document {
  _id: string;
  userId: string;
  title: string;
  originalFilename: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  analyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  _id: string;
  documentId: string;
  type: 'addition' | 'deletion' | 'modification' | 'information';
  content: string;
  originalText?: string;
  suggestedText?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
} 