import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardB extends ExternalDocumentBase {
  public freeText: string;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardB');

    this.freeText = rawProps.freeText;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardB.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.freeText);
  }
}

export type RawExternalDocumentNonStandardB =
  ExcludeMethods<ExternalDocumentNonStandardB>;
