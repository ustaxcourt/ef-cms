const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const joi = require('joi-browser');

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
  createdAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The received date is in the future. Please enter a valid date.',
    },
    'Please enter a valid date.',
  ],
  petitionFile: 'The Petition file was not selected.',
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  createdAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
  ownershipDisclosureFile: joi.object().optional(),
  petitionFile: joi.object().required(),
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

module.exports = PetitionFromPaper;
