const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param {object} rawProps the metadata
 * @constructor
 */
function AddIrsPractitioner(rawProps) {
  Object.assign(this, {
    user: rawProps.user,
  });
}

AddIrsPractitioner.VALIDATION_ERROR_MESSAGES = {
  user: 'Select a respondent counsel',
};

AddIrsPractitioner.schema = joi.object().keys({
  user: joi.object().required(),
});

joiValidationDecorator(
  AddIrsPractitioner,
  AddIrsPractitioner.schema,
  AddIrsPractitioner.VALIDATION_ERROR_MESSAGES,
);

module.exports = { AddIrsPractitioner };
