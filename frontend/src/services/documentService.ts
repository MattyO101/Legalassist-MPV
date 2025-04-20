import { documentApi } from './apiService';
import { Document, Recommendation } from '../types/document.types';

interface DocumentsResponse {
  documents: Document[];
}

interface DocumentResponse {
  document: Document;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

interface RecommendationResponse {
  recommendation: Recommendation;
}

interface AnalysisResult {
  success: boolean;
  count: number;
}

export const getDocuments = async (): Promise<Document[]> => {
  const response = await documentApi.get<DocumentsResponse>('/documents');
  return response.data.documents;
};

export const getDocument = async (id: string): Promise<Document> => {
  const response = await documentApi.get<DocumentResponse>(`/documents/${id}`);
  return response.data.document;
};

export const uploadDocument = async (formData: FormData): Promise<Document> => {
  const response = await documentApi.post<DocumentResponse>('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.document;
};

export const deleteDocument = async (id: string): Promise<{ success: boolean }> => {
  const response = await documentApi.delete(`/documents/${id}`);
  return response.data;
};

export const analyzeDocument = async (id: string): Promise<AnalysisResult> => {
  const response = await documentApi.post<AnalysisResult>(`/documents/${id}/analyze`);
  return response.data;
};

export const getDocumentStatus = async (id: string): Promise<{ status: string }> => {
  const response = await documentApi.get<{ status: string }>(`/documents/${id}/status`);
  return response.data;
};

export const getDocumentRecommendations = async (documentId: string): Promise<Recommendation[]> => {
  const response = await documentApi.get<RecommendationsResponse>(`/recommendations/document/${documentId}`);
  return response.data.recommendations;
};

export const applyRecommendation = async (id: string): Promise<Recommendation> => {
  const response = await documentApi.post<RecommendationResponse>(`/recommendations/${id}/apply`);
  return response.data.recommendation;
};

export const rejectRecommendation = async (id: string): Promise<Recommendation> => {
  const response = await documentApi.post<RecommendationResponse>(`/recommendations/${id}/reject`);
  return response.data.recommendation;
}; 