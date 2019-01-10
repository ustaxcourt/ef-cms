const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionWithoutFiles(rawPetition) {
  Object.assign(this, rawPetition);
}

joiValidationDecorator(
  PetitionWithoutFiles,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi.string().optional(),
    procedureType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
  }),
);

module.exports = PetitionWithoutFiles;
