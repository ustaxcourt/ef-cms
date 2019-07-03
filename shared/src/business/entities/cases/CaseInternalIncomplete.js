const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * CaseInternalIncomplete
 * Represents a Case without required documents that a Petitions Clerk is attempting to add to the system.
 * After the Case's files have been saved, a PetitionFromPaper is created to include the document metadata.
 * @param rawCase
 * @constructor
 */
function CaseInternalIncomplete(rawCase) {
  this.caseCaption = rawCase.caseCaption;
  this.petitionFileId = rawCase.petitionFileId;
  this.receivedAt = rawCase.receivedAt;
}

CaseInternalIncomplete.errorToMessageMap = {
  caseCaption: 'Case Caption is required.',
  petitionFileId: 'A petition file id is required.',
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The received date is in the future. Please enter a valid date.',
    },
    'Please enter a valid date.',
  ],
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  petitionFileId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
});

joiValidationDecorator(
  CaseInternalIncomplete,
  paperRequirements,
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseInternalIncomplete.errorToMessageMap,
);

module.exports = { CaseInternalIncomplete };
