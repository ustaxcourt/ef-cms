import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardE extends ExternalDocumentBase {
  public trialLocation: string;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardE');

    this.trialLocation = rawProps.trialLocation;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    trialLocation: JoiValidationConstants.STRING.required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardE.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.trialLocation);
  }
}

export type RawExternalDocumentNonStandardE =
  ExcludeMethods<ExternalDocumentNonStandardE>;
