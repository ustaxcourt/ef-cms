const Joi = require('joi');

const uuidVersions = {
  version: ['uuidv4'],
};

// TODO: talk to Doug about if we should be using
// separate validation methods for different use cases, or a single validation method?
const caseSchema = Joi.object().keys({
  caseId: Joi.string()
    .uuid(uuidVersions)
    .optional(),
  userId: Joi.string()
    // .uuid(uuidVersions)
    .optional(),
  createdAt: Joi.date()
    .iso()
    .optional(),
  docketNumber: Joi.string()
    .regex(/^[0-9]{5}-[0-9]{2}$/)
    .optional(),
  status: Joi.string()
    .regex(/^(new)|(general)$/)
    .optional(),
  documents: Joi.array()
    .length(3)
    .items(
      Joi.object({
        documentId: Joi.string()
          .uuid(uuidVersions)
          .required(),
        documentType: Joi.string().required(),
      }),
    )
    .required(),
});

function Case(rawCase) {
  Object.assign(this, rawCase);
}

Case.prototype.isValid = function isValid() {
  return Joi.validate(this, caseSchema).error === null;
};

Case.prototype.getValidationError = function getValidationError() {
  return Joi.validate(this, caseSchema).error;
};

module.exports = Case;
