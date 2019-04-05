const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawPetition
 * @constructor
 */
function PetitionFromPaperWithoutFiles(rawPetition) {
  Object.assign(this, rawPetition);
}

PetitionFromPaperWithoutFiles.errorToMessageMap = {
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

const uuidVersions = {
  version: ['uuidv4'],
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  petitionFileId: joi
    .string()
    .uuid(uuidVersions)
    .required(),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
});

joiValidationDecorator(
  PetitionFromPaperWithoutFiles,
  paperRequirements,
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionFromPaperWithoutFiles.errorToMessageMap,
);

module.exports = { PetitionFromPaperWithoutFiles };
