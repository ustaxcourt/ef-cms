import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
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

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    documentType: JoiValidationConstants.STRING.required()
      .when('selectedCases', {
        is: joi.array().min(1).required(),
        then: JoiValidationConstants.STRING.invalid(
          'Proposed Stipulated Decision',
        ),
      })
      .messages({
        ...setDefaultErrorMessage('Select a document type'),
        'any.invalid':
          'Proposed Stipulated Decision must be filed separately in each case',
      }),
    selectedCases: joi.array().items(JoiValidationConstants.STRING).optional(),
  };

  getValidationRules_NEW() {
    return ExternalDocumentStandard.VALIDATION_RULES_NEW;
  }
}

export type RawExternalDocumentStandard =
  ExcludeMethods<ExternalDocumentStandard>;
