const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

const documentTypes = [
  'Petition',
  'Request for Place of Trial',
  'Statement of Taxpayer Identification Number',
  'Answer',
];

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
    createdAt: joi
      .date()
      .iso()
      .optional(),
  }),
);

module.exports = Document;
