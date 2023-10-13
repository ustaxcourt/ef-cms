import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    trialLocation: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Select a preferred trial location.'),
    ),
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardE.VALIDATION_RULES_NEW;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.trialLocation);
  }
}

export type RawExternalDocumentNonStandardE =
  ExcludeMethods<ExternalDocumentNonStandardE>;
