import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import joi from 'joi';

export class ExternalDocumentStandard extends ExternalDocument {
  public selectedCases: any;

  constructor(rawProps) {
    super('ExternalDocumentStandard');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
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

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentStandard.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle(): string {
    return this.documentTitle!;
  }
}

export type RawExternalDocumentStandard =
  ExcludeMethods<ExternalDocumentStandard>;
