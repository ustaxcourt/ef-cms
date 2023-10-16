import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class EditPetitionerCounsel extends JoiValidationEntity {
  public representing: string[];

  constructor(rawProps) {
    super('EditPetitionerCounsel');
    this.representing = rawProps.representing;
  }

  static VALIDATION_RULES = {
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
  } as const;

  static VALIDATION_ERROR_MESSAGES = {
    representing: 'Select a representing party',
  } as const;

  getValidationRules() {
    return EditPetitionerCounsel.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required()
      .messages(setDefaultErrorMessage('Select a representing party')),
  } as const;

  getValidationRules_NEW() {
    return EditPetitionerCounsel.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return EditPetitionerCounsel.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawEditPetitionerCounsel = ExcludeMethods<EditPetitionerCounsel>;
