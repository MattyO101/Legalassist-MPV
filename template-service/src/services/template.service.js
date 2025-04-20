const Template = require('../models/template.model');
const UserTemplate = require('../models/userTemplate.model');
const exportService = require('./export.service');
const ApiError = require('../utils/ApiError');

const getTemplates = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  return Template.find(query);
};

const getTemplateCategories = async () => {
  return Template.distinct('category', { isActive: true });
};

const getTemplateById = async (id) => {
  const template = await Template.findOne({ _id: id, isActive: true });
  
  if (!template) {
    throw ApiError.notFound('Template not found');
  }
  
  return template;
};

const customizeTemplate = async (id, data) => {
  const template = await getTemplateById(id);
  
  // In a real application, we would validate the data against the template fields
  // For MVP, we'll just return the template with the data
  
  return {
    template,
    customizedData: data
  };
};

const exportTemplate = async (id, data, format = 'pdf') => {
  const template = await getTemplateById(id);
  
  if (format === 'pdf') {
    return exportService.exportAsPdf(template, data);
  } else if (format === 'docx') {
    return exportService.exportAsDocx(template, data);
  } else {
    throw ApiError.badRequest('Invalid export format');
  }
};

const getUserTemplates = async (userId) => {
  return UserTemplate.find({ userId, isActive: true })
    .populate('templateId')
    .sort({ updatedAt: -1 });
};

const saveUserTemplate = async (userId, templateId, title, data) => {
  // Check if template exists
  await getTemplateById(templateId);
  
  // Create or update user template
  const userTemplate = await UserTemplate.findOneAndUpdate(
    { userId, templateId, isActive: true },
    { title, data },
    { new: true, upsert: true }
  );
  
  return userTemplate;
};

const deleteUserTemplate = async (userId, id) => {
  const userTemplate = await UserTemplate.findOne({ _id: id, userId });
  
  if (!userTemplate) {
    throw ApiError.notFound('Template not found');
  }
  
  userTemplate.isActive = false;
  await userTemplate.save();
  
  return { success: true };
};

// Seed initial templates - for MVP only
const seedInitialTemplates = async () => {
  const templatesCount = await Template.countDocuments();
  
  if (templatesCount > 0) {
    return; // Templates already exist
  }
  
  // Sample templates for MVP
  const templates = [
    {
      title: 'Service Agreement',
      description: 'A basic service agreement for freelancers and clients',
      category: 'agreement',
      fields: [
        {
          name: 'clientName',
          label: 'Client Name',
          type: 'text',
          required: true,
          placeholder: 'Enter client name',
          description: 'Full legal name of the client'
        },
        {
          name: 'providerName',
          label: 'Provider Name',
          type: 'text',
          required: true,
          placeholder: 'Enter provider name',
          description: 'Full legal name of the service provider'
        },
        {
          name: 'serviceDescription',
          label: 'Service Description',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the services to be provided',
          description: 'Detailed description of the services'
        },
        {
          name: 'paymentAmount',
          label: 'Payment Amount',
          type: 'text',
          required: true,
          placeholder: 'Enter payment amount',
          description: 'The amount to be paid for the services'
        },
        {
          name: 'paymentSchedule',
          label: 'Payment Schedule',
          type: 'select',
          options: ['Weekly', 'Bi-weekly', 'Monthly', 'Upon completion'],
          required: true,
          description: 'When payments will be made'
        },
        {
          name: 'startDate',
          label: 'Start Date',
          type: 'date',
          required: true,
          description: 'When the services will begin'
        },
        {
          name: 'endDate',
          label: 'End Date',
          type: 'date',
          required: false,
          description: 'When the services will end (if applicable)'
        }
      ],
      content: `SERVICE AGREEMENT

This Service Agreement (the "Agreement") is entered into on {startDate} by and between {clientName} ("Client") and {providerName} ("Provider").

1. SERVICES
Provider agrees to provide the following services to Client:
{serviceDescription}

2. PAYMENT
Client agrees to pay Provider {paymentAmount} for the services. Payments will be made {paymentSchedule}.

3. TERM
This Agreement shall commence on {startDate} and shall continue until {endDate} or until the services are completed.

4. CONFIDENTIALITY
Both parties agree to keep all business information, documents, and other materials disclosed confidential.

5. TERMINATION
Either party may terminate this Agreement with 30 days written notice.

6. GOVERNING LAW
This Agreement shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

CLIENT: {clientName}
PROVIDER: {providerName}`,
      isActive: true
    },
    {
      title: 'Non-Disclosure Agreement',
      description: 'A standard non-disclosure agreement to protect confidential information',
      category: 'agreement',
      fields: [
        {
          name: 'partyOne',
          label: 'First Party Name',
          type: 'text',
          required: true,
          placeholder: 'Enter first party name'
        },
        {
          name: 'partyTwo',
          label: 'Second Party Name',
          type: 'text',
          required: true,
          placeholder: 'Enter second party name'
        },
        {
          name: 'purpose',
          label: 'Purpose of Disclosure',
          type: 'textarea',
          required: true,
          placeholder: 'Describe the purpose of sharing confidential information'
        },
        {
          name: 'effectiveDate',
          label: 'Effective Date',
          type: 'date',
          required: true
        },
        {
          name: 'duration',
          label: 'Duration (in years)',
          type: 'select',
          options: ['1', '2', '3', '5', '10'],
          required: true
        }
      ],
      content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on {effectiveDate} by and between {partyOne} and {partyTwo}.

1. PURPOSE
The parties wish to explore a business opportunity of mutual interest, specifically: {purpose}

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation.

3. NON-DISCLOSURE
The receiving party shall not disclose any Confidential Information to third parties and shall use Confidential Information only for the Purpose.

4. TERM
This Agreement shall remain in effect for {duration} years from the Effective Date.

5. GOVERNING LAW
This Agreement shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{partyOne}
{partyTwo}`,
      isActive: true
    },
    {
      title: 'Invoice',
      description: 'A professional invoice template',
      category: 'form',
      fields: [
        {
          name: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true
        },
        {
          name: 'clientName',
          label: 'Client Name',
          type: 'text',
          required: true
        },
        {
          name: 'invoiceNumber',
          label: 'Invoice Number',
          type: 'text',
          required: true
        },
        {
          name: 'issueDate',
          label: 'Issue Date',
          type: 'date',
          required: true
        },
        {
          name: 'dueDate',
          label: 'Due Date',
          type: 'date',
          required: true
        },
        {
          name: 'items',
          label: 'Invoice Items (format: item, quantity, price)',
          type: 'textarea',
          required: true,
          description: 'Enter each item on a new line: item, quantity, price'
        },
        {
          name: 'totalAmount',
          label: 'Total Amount',
          type: 'text',
          required: true
        }
      ],
      content: `INVOICE

{companyName}
Invoice #: {invoiceNumber}

BILL TO:
{clientName}

ISSUE DATE: {issueDate}
DUE DATE: {dueDate}

ITEMS:
{items}

TOTAL AMOUNT DUE: {totalAmount}

Thank you for your business!`,
      isActive: true
    }
  ];
  
  await Template.insertMany(templates);
  console.log('Initial templates seeded');
};

module.exports = {
  getTemplates,
  getTemplateCategories,
  getTemplateById,
  customizeTemplate,
  exportTemplate,
  getUserTemplates,
  saveUserTemplate,
  deleteUserTemplate,
  seedInitialTemplates
}; 