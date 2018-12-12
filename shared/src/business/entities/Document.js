const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

const petitionDocumentTypes = [
  'Petition',
  'Request for Place of Trial',
  'Statement of Taxpayer Identification Number',
];

const documentTypes = [...petitionDocumentTypes, 'Answer'];

/**
 * constructor
 * @param rawDocument
 * @constructor
 */
function Document(rawDocument) {
  Object.assign(this, rawDocument, {
    createdAt: new Date().toISOString(),
  });
}

Document.prototype.isPetitionDocument = function() {
  return petitionDocumentTypes.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    documentType: joi
      .string()
      .valid(documentTypes)
      .required(),
    documentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .required(),
    validated: joi.boolean().optional(),
    reviewDate: joi
      .date()
      .iso()
      .optional(),
    reviewUser: joi.string().optional(),
    status: joi.string().optional(),
    servedDate: joi
      .date()
      .iso()
      .optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
  }),
);

module.exports = Document;
