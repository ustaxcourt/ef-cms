const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

/**
 * constructor
 * @param rawCaseInitiator
 * @constructor
 */
function CaseInitiator(rawCaseInitiator) {
  Object.assign(this, rawCaseInitiator);
}

joiValidationDecorator(
  CaseInitiator,
  joi.object().keys({
    petitionFile: joi.object().required(),
    irsNoticeFile: joi.object().optional(),
  }),
);

module.exports = CaseInitiator;
