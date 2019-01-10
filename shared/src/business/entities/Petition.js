const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function Petition(rawPetition) {
  Object.assign(this, rawPetition);
}

joiValidationDecorator(
  Petition,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi.string().optional(),
    // irsNoticeFile: joi.object().optional(),
    petitionFile: joi.object().required(),
    procedureType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
  }),
);

module.exports = Petition;
