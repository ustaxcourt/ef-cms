import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardJ extends ExternalDocumentBase {
  public freeText: string;
  public freeText2: string;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardJ');

    this.freeText = rawProps.freeText;
    this.freeText2 = rawProps.freeText2;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
    freeText2: JoiValidationConstants.STRING.max(1000).required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardJ.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.freeText, this.freeText2);
  }
}

export type RawExternalDocumentNonStandardJ =
  ExcludeMethods<ExternalDocumentNonStandardJ>;
