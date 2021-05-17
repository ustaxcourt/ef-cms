const joi = require('joi');
const {
  AddPrivatePractitionerFactory,
} = require('./AddPrivatePractitionerFactory');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @constructor
 */
function EditPetitionerCounselFactory() {}

EditPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES = {
  ...AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  representing: 'Select a representing party',
};

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
EditPetitionerCounselFactory.get = metadata => {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawProps) {
    Object.assign(this, {
      representing: rawProps.representing,
    });
  };

  let schema = {
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
  };

  joiValidationDecorator(
    entityConstructor,
    schema,
    EditPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(metadata);
};

module.exports = { EditPetitionerCounselFactory };
