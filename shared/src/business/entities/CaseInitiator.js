const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

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
  }),
);

module.exports = { CaseInitiator };
