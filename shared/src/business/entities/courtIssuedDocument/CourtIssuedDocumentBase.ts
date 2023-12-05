import { CourtIssuedDocument } from './CourtIssuedDocumentConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { UNSERVABLE_EVENT_CODES } from '../EntityConstants';
import joi from 'joi';

export class CourtIssuedDocumentBase extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentBase');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
  }

  static VALIDATION_RULES = {
    attachments: joi
      .boolean()
      .required()
      .messages({ '*': 'Enter selection for Attachments' }),
    documentTitle: JoiValidationConstants.STRING.optional(),
    documentType: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a document type',
    }),
    eventCode: JoiValidationConstants.STRING.optional(),
    filingDate: joi
      .when('eventCode', {
        is: joi
          .exist()
          .not(null)
          .valid(...UNSERVABLE_EVENT_CODES),
        otherwise: joi.optional().allow(null),
        then: JoiValidationConstants.ISO_DATE.max('now').required(),
      })
      .messages({ '*': 'Enter a filing date' }),
  };

  getValidationRules() {
    return CourtIssuedDocumentBase.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return this.documentTitle!;
  }
}

export type RawCourtIssuedDocumentBase =
  ExcludeMethods<CourtIssuedDocumentBase>;
