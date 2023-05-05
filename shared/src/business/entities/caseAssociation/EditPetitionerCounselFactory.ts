import { AddPrivatePractitionerFactory } from './AddPrivatePractitionerFactory';
import { JoiValidationConstants } from '../JoiValidationConstants';
import {
  joiValidationDecorator,
  validEntityDecorator,
} from '../JoiValidationDecorator';
import joi from 'joi';

/**
 * Edit Petitioner Counsel Factory entity
 *
 * @param {object} rawProps the raw counsel data
 * @constructor
 */
export function EditPetitionerCounselFactory(rawProps) {
  /**
   * bare constructor for entity factory
   */
  function entityConstructor() {}

  entityConstructor.prototype.init = function init(rawPropsParam) {
    Object.assign(this, {
      representing: rawPropsParam.representing,
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

  return new (validEntityDecorator(entityConstructor))(rawProps);
}

EditPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES = {
  ...AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  representing: 'Select a representing party',
};
