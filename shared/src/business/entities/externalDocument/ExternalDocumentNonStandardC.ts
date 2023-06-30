import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class ExternalDocumentNonStandardC extends ExternalDocumentBase {
  public freeText: string;
  public previousDocument: { documentTitle?: string; documentType: string };

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardC');

    this.freeText = rawProps.freeText;
    this.previousDocument = rawProps.previousDocument;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardC.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return {
      ...ExternalDocumentBase.VALIDATION_ERROR_MESSAGES,
      freeText: [
        { contains: 'is required', message: 'Enter name' },
        {
          contains: 'must be less than or equal to',
          message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
        },
      ],
    };
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.freeText,
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
    );
  }
}

export type RawExternalDocumentNonStandardC =
  ExcludeMethods<ExternalDocumentNonStandardC>;
