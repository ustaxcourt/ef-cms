import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class ExternalDocumentNonStandardA extends ExternalDocumentBase {
  public previousDocument: { documentTitle?: string; documentType: string };

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardA');

    this.previousDocument = rawProps.previousDocument;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardA.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
    );
  }
}

export type RawExternalDocumentNonStandardA =
  ExcludeMethods<ExternalDocumentNonStandardA>;
