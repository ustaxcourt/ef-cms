import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
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
    attachments: joi.boolean().required(),
    documentTitle: JoiValidationConstants.STRING.optional(),
    documentType: JoiValidationConstants.STRING.required(),
    eventCode: JoiValidationConstants.STRING.optional(),
    filingDate: joi.when('eventCode', {
      is: joi
        .exist()
        .not(null)
        .valid(...UNSERVABLE_EVENT_CODES),
      otherwise: joi.optional().allow(null),
      then: JoiValidationConstants.ISO_DATE.max('now').required(),
    }),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return this.documentTitle!;
  }

  getValidationRules() {
    return CourtIssuedDocumentBase.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentBase.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentBase =
  ExcludeMethods<CourtIssuedDocumentBase>;
