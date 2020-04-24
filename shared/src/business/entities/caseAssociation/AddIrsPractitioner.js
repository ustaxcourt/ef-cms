const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param {object} rawProps the metadata
 * @constructor
 */
function AddIrsPractitioner(rawProps) {
  this.entityName = 'AddIrsPractitioner';

  Object.assign(this, {
    user: rawProps.user,
  });
}

AddIrsPractitioner.VALIDATION_ERROR_MESSAGES = {
  user: 'Select a respondent counsel',
};

AddIrsPractitioner.schema = joi.object().keys({
  entityName: joi.string().valid('AddIrsPractitioner').required(),
  user: joi.object().required(),
});

joiValidationDecorator(
  AddIrsPractitioner,
  AddIrsPractitioner.schema,
  undefined,
  AddIrsPractitioner.VALIDATION_ERROR_MESSAGES,
);

module.exports = { AddIrsPractitioner };
