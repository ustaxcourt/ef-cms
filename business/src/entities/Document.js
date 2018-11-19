const joi = require('joi');
const uuidv4 = require('uuid/v4');
const documentTypes = require('./Case').documentTypes;

const uuidVersions = {
  version: ['uuidv4'],
};

const documentSchema = joi.object().keys({
  documentId: joi
    .string()
    .uuid(uuidVersions)
    .optional(),
  userId: joi
    .string()
    // .uuid(uuidVersions)
    .optional(),
  createdAt: joi
    .date()
    .iso()
    .optional(),
  documentType: joi
    .string()
    .valid(documentTypes)
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
