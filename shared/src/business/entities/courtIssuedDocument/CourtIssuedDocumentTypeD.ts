import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
  yesterdayFormatted,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class CourtIssuedDocumentTypeD extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public createdAt: any;
  public date: string;
  public freeText?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeD');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.createdAt = rawProps.createdAt;
    this.date = rawProps.date;
    this.freeText = rawProps.freeText;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    date: joi.when('createdAt', {
      is: joi.exist().not(null),
      otherwise:
        JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
      then: JoiValidationConstants.ISO_DATE.required(),
    }),
    freeText: JoiValidationConstants.STRING.max(1000).optional(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return replaceBracketed(
      this.documentTitle,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
      this.freeText,
    );
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeD.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeD.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeD =
  ExcludeMethods<CourtIssuedDocumentTypeD>;
