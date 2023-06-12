import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
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

  getErrorToMessageMap() {
    return EditPetitionerCounsel.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawEditPetitionerCounsel = ExcludeMethods<EditPetitionerCounsel>;
