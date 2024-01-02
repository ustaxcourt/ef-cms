import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
export class ExternalDocumentBase extends JoiValidationEntity {
  public category: string;
  public documentTitle?: string;
  public documentType: string;

  constructor(rawProps, scenario: string) {
    super(scenario);

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
  }

  static VALIDATION_RULES = {
    category: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a Category.',
    }),
    documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional().messages({
      '*': 'Document title must be 3000 characters or fewer. Update this document title and try again.',
    }),
    documentType: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a document type',
      'string.invalid':
        'Proposed Stipulated Decision must be filed separately in each case',
    }),
  };

  getValidationRules() {
    return ExternalDocumentBase.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return this.documentTitle!;
  }
}

export type RawExternalDocumentBase = ExcludeMethods<ExternalDocumentBase>;
