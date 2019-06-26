const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../persistence/s3/getUploadPolicy');

/**
 * PetitionFromPaper Entity
 * Represents a Case with required documents that a Petitions Clerk is attempting to add to the system.
 * @param rawPetition
 * @constructor
 */
function PetitionFromPaper(rawPetition) {
  Object.assign(this, {
    caseCaption: rawPetition.caseCaption,
    ownershipDisclosureFile: rawPetition.ownershipDisclosureFile,
    petitionFile: rawPetition.petitionFile,
    petitionFileSize: rawPetition.petitionFileSize,
    receivedAt: rawPetition.receivedAt,
    stinFile: rawPetition.stinFile,
    stinFileSize: rawPetition.stinFileSize,
  });
}

PetitionFromPaper.errorToMessageMap = {
  caseCaption: 'Case Caption is required.',
  petitionFile: 'The Petition file was not selected.',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty.',
  ],
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The received date is in the future. Please enter a valid date.',
    },
    'Please enter a valid date.',
  ],
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty.',
  ],
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  ownershipDisclosureFile: joi.object().optional(),
  petitionFile: joi.object().required(),
  petitionFileSize: joi.when('petitionFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
  stinFile: joi.object().optional(),
  stinFileSize: joi.when('stinFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
});

joiValidationDecorator(
  PetitionFromPaper,
  paperRequirements,
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionFromPaper.errorToMessageMap,
);

module.exports = { PetitionFromPaper };
