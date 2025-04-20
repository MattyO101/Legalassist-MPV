const templateService = require('../services/template.service');
const ApiError = require('../utils/ApiError');

const getTemplates = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filters = category ? { category } : {};
    
    const templates = await templateService.getTemplates(filters);
    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

const getTemplateCategories = async (req, res, next) => {
  try {
    const categories = await templateService.getTemplateCategories();
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

const getTemplate = async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};

const customizeTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (!data || Object.keys(data).length === 0) {
      throw ApiError.badRequest('Template data is required');
    }
    
    const result = await templateService.customizeTemplate(id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const exportTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, format } = req.body;
    
    if (!data || Object.keys(data).length === 0) {
      throw ApiError.badRequest('Template data is required');
    }
    
    const result = await templateService.exportTemplate(id, data, format);
    
    // In a real app, we would stream the file to the client or provide a download link
    // For MVP, we'll just return the path
    res.status(200).json({
      message: 'Template exported successfully',
      filename: result.filename,
      // In a real app, this would be a full URL
      downloadUrl: `/downloads/${result.filename}`
    });
  } catch (error) {
    next(error);
  }
};

const getUserTemplates = async (req, res, next) => {
  try {
    const templates = await templateService.getUserTemplates(req.user.id);
    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

const saveUserTemplate = async (req, res, next) => {
  try {
    const { templateId, title, data } = req.body;
    
    if (!templateId || !title || !data) {
      throw ApiError.badRequest('Template ID, title and data are required');
    }
    
    const template = await templateService.saveUserTemplate(
      req.user.id,
      templateId,
      title,
      data
    );
    
    res.status(200).json({ template });
  } catch (error) {
    next(error);
  }
};

const deleteUserTemplate = async (req, res, next) => {
  try {
    const result = await templateService.deleteUserTemplate(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  getTemplateCategories,
  getTemplate,
  customizeTemplate,
  exportTemplate,
  getUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
}; 