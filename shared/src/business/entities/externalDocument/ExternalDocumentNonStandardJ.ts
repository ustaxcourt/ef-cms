import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardJ extends ExternalDocument {
  public freeText: any;
  public freeText2: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardJ');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.freeText = rawProps.freeText;
    this.freeText2 = rawProps.freeText2;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
    freeText2: JoiValidationConstants.STRING.max(1000).required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentNonStandardJ.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.freeText, this.freeText2);
  }
}

export type RawExternalDocumentNonStandardJ =
  ExcludeMethods<ExternalDocumentNonStandardJ>;
