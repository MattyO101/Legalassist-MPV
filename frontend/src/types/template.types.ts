export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
}

export interface Template {
  _id: string;
  title: string;
  description: string;
  category: 'contract' | 'agreement' | 'letter' | 'form' | 'policy' | 'other';
  fields: TemplateField[];
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserTemplate {
  _id: string;
  userId: string;
  templateId: Template | string;
  title: string;
  data: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  userTemplates: UserTemplate[];
  customizedTemplate: Template | null;
  customizedData: Record<string, any> | null;
  loading: boolean;
  error: string | null;
} 