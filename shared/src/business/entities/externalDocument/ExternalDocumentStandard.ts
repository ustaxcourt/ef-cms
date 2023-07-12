import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import joi from 'joi';

export class ExternalDocumentStandard extends ExternalDocumentBase {
  public selectedCases?: string[];

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentStandard');

    this.selectedCases = rawProps.selectedCases;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    documentType: JoiValidationConstants.STRING.required().when(
      'selectedCases',
      {
        is: joi.array().min(1).required(),
        then: JoiValidationConstants.STRING.invalid(
          'Proposed Stipulated Decision',
        ),
      },
    ),
    selectedCases: joi.array().items(JoiValidationConstants.STRING).optional(),
  };

  getValidationRules() {
    return ExternalDocumentStandard.VALIDATION_RULES;
  }
}

export type RawExternalDocumentStandard =
  ExcludeMethods<ExternalDocumentStandard>;
