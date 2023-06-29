import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardE extends ExternalDocument {
  public trialLocation: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardE');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.trialLocation = rawProps.trialLocation;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    trialLocation: JoiValidationConstants.STRING.required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentNonStandardE.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.trialLocation);
  }
}

export type RawExternalDocumentNonStandardE =
  ExcludeMethods<ExternalDocumentNonStandardE>;
