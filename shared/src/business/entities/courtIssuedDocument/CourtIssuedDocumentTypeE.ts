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

export class CourtIssuedDocumentTypeE extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public createdAt: any;
  public date: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeE');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.createdAt = rawProps.createdAt;
    this.date = rawProps.date;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    date: joi.when('createdAt', {
      is: joi.exist().not(null),
      otherwise:
        JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
      then: JoiValidationConstants.ISO_DATE.required(),
    }),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return replaceBracketed(
      this.documentTitle,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    );
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeE.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeE.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeE =
  ExcludeMethods<CourtIssuedDocumentTypeE>;
