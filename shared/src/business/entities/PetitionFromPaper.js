const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawPetition
 * @constructor
 */
function PetitionFromPaper(rawPetition) {
  Object.assign(this, rawPetition);
}

PetitionFromPaper.errorToMessageMap = {
  caseCaption: 'Case Caption is required.',
  petitionFile: 'The Petition file was not selected.',
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
  ownershipDisclosureFile: joi.object().optional(),
  petitionFile: joi.object().required(),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
  stinFile: joi.object().optional(),
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
