import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { MAX_FILE_SIZE_MB } from '../EntityConstants';

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
    category: JoiValidationConstants.STRING.required(),
    documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional(),
    documentType: JoiValidationConstants.STRING.required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    additionalInfo: [
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 500 characters. Enter 500 or fewer characters.',
      },
    ],
    additionalInfo2: [
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 500 characters. Enter 500 or fewer characters.',
      },
    ],
    attachments: 'Enter selection for Attachments.',
    category: 'Select a Category.',
    certificateOfService:
      'Indicate whether you are including a Certificate of Service',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      },
      'Enter date of service',
    ],
    documentTitle:
      'Document title must be 3000 characters or fewer. Update this document title and try again.',
    documentType: [
      {
        contains: 'contains an invalid value',
        message:
          'Proposed Stipulated Decision must be filed separately in each case',
      },
      'Select a document type',
    ],
    filers: 'Select a filing party',
    freeText: [
      { contains: 'is required', message: 'Provide an answer' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      },
    ],
    freeText2: [
      { contains: 'is required', message: 'Provide an answer' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      },
    ],
    hasSecondarySupportingDocuments:
      'Enter selection for Secondary Supporting Documents.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    objections: 'Enter selection for Objections.',
    ordinalValue: 'Select an iteration',
    otherIteration: [
      {
        contains: 'is required',
        message: 'Enter an iteration number.',
      },
      'Maximum iteration value is 999.',
    ],
    partyIrsPractitioner: 'Select a filing party',
    previousDocument: 'Select a document',
    primaryDocumentFile: 'Upload a document',
    primaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Primary Document file size is empty.',
    ],
    secondaryDocument: 'Select a document',
    secondaryDocumentFile: 'Upload a document',
    secondaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty.',
    ],
    serviceDate: [
      {
        contains: 'must be less than or equal to',
        message: 'Service date cannot be in the future. Enter a valid date.',
      },
      'Provide a service date',
    ],
    supportingDocument: 'Select a document type',
    supportingDocumentFile: 'Upload a document',
    supportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Supporting Document file size is empty.',
    ],
    supportingDocumentFreeText: 'Enter name',
    trialLocation: 'Select a preferred trial location.',
  } as const;

  getValidationRules() {
    return ExternalDocumentBase.VALIDATION_RULES;
  }

  getErrorToMessageMap(): any {
    return ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle() {
    return this.documentTitle!;
  }
}

export type RawExternalDocumentBase = ExcludeMethods<ExternalDocumentBase>;
