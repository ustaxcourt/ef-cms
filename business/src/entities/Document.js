const joi = require('joi');
const uuidv4 = require('uuid/v4');

const uuidVersions = {
  version: ['uuidv4'],
};

const documentTypes = [
  'Petition',
  'Request for Place of Trial',
  'Statement of Taxpayer Identification Number',
];

const documentSchema = joi.object().keys({
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
  createdAt: joi
    .date()
    .iso()
    .optional(),
});

function Document(rawDocument) {
  Object.assign(this, rawDocument, {
    documentId: uuidv4(),
    createdAt: new Date().toISOString(),
  });
}

Document.prototype.isValid = function isValid() {
  return joi.validate(this, documentSchema).error === null;
};

Document.prototype.getValidationError = function getValidationError() {
  return joi.validate(this, documentSchema).error;
};

Document.prototype.validate = function validate() {
  if (!this.isValid()) {
    throw new Error('The document was invalid ' + this.getValidationError());
  }
};

module.exports = Document;
