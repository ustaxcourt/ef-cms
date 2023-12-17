import { ExcludeMethods } from 'types/TEntity';
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
    freeText: JoiValidationConstants.STRING.max(1000).required().messages({
      'any.required': 'Provide an answer',
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    }),
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
