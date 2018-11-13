const Joi = require('joi');

const uuidVersions = {
  version: ['uuidv4'],
};

const caseSchema = Joi.object().keys({
  caseId: Joi.string()
    .uuid(uuidVersions)
    .optional(),
  userId: Joi.string()
    .uuid(uuidVersions)
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
  this.documents = rawCase.documents;
}

Case.prototype.isValid = function isValid() {
  return Joi.validate(this, caseSchema).error === null;
};

module.exports = Case;
