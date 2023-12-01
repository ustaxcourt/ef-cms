import {
  CourtIssuedDocument,
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
    date: joi
      .when('createdAt', {
        is: joi.exist().not(null),
        otherwise:
          JoiValidationConstants.ISO_DATE.min(yesterdayFormatted).required(),
        then: JoiValidationConstants.ISO_DATE.required(),
      })
      .messages({
        '*': 'Enter a date',
        'date.max': 'Enter a valid date',
        'date.min': 'Enter a valid date',
      }),
  };

  getValidationRules() {
    return CourtIssuedDocumentTypeE.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return replaceBracketed(
      this.documentTitle,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    );
  }
}

export type RawCourtIssuedDocumentTypeE =
  ExcludeMethods<CourtIssuedDocumentTypeE>;
