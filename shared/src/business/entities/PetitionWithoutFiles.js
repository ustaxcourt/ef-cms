const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionWithoutFiles(rawPetition) {
  Object.assign(this, rawPetition, {
    irsNoticeDate: rawPetition.irsNoticeDate
      ? new Date(rawPetition.irsNoticeDate).toISOString()
      : undefined,
  });
}

joiValidationDecorator(
  PetitionWithoutFiles,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi
      .date()
      .iso()
      .optional(),
    procedureType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
  }),
);

module.exports = PetitionWithoutFiles;
