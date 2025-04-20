import { templateApi } from './apiService';
import { Template, UserTemplate } from '../types/template.types';

interface TemplatesResponse {
  templates: Template[];
}

interface TemplateResponse {
  template: Template;
}

interface CategoriesResponse {
  categories: string[];
}

interface UserTemplatesResponse {
  templates: UserTemplate[];
}

interface CustomizeResponse {
  template: Template;
  customizedData: Record<string, any>;
}

interface ExportResponse {
  message: string;
  filename: string;
  downloadUrl: string;
}

export const getTemplates = async (category?: string): Promise<Template[]> => {
  const params = category ? { category } : {};
  const response = await templateApi.get<TemplatesResponse>('/templates', { params });
  return response.data.templates;
};

export const getTemplateCategories = async (): Promise<string[]> => {
  const response = await templateApi.get<CategoriesResponse>('/templates/categories');
  return response.data.categories;
};

export const getTemplate = async (id: string): Promise<Template> => {
  const response = await templateApi.get<TemplateResponse>(`/templates/${id}`);
  return response.data.template;
};

export const customizeTemplate = async (id: string, data: Record<string, any>): Promise<CustomizeResponse> => {
  const response = await templateApi.post<CustomizeResponse>(`/templates/${id}/customize`, data);
  return response.data;
};

export const exportTemplate = async (
  id: string, 
  data: Record<string, any>, 
  format = 'pdf'
): Promise<ExportResponse> => {
  const response = await templateApi.post<ExportResponse>(`/templates/${id}/export`, { data, format });
  return response.data;
};

export const getUserTemplates = async (): Promise<UserTemplate[]> => {
  const response = await templateApi.get<UserTemplatesResponse>('/templates/user/templates');
  return response.data.templates;
};

export const saveUserTemplate = async (
  templateId: string, 
  title: string, 
  data: Record<string, any>
): Promise<UserTemplate> => {
  const response = await templateApi.post<{ template: UserTemplate }>('/templates/user/templates', {
    templateId,
    title,
    data
  });
  return response.data.template;
};

export const deleteUserTemplate = async (id: string): Promise<{ success: boolean }> => {
  const response = await templateApi.delete(`/templates/user/templates/${id}`);
  return response.data;
}; 