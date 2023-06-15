import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentDefault } from './CourtIssuedDocumentDefault';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class CourtIssuedDocumentTypeH extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public date: string;
  public freeText: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeH');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.date = rawProps.date;
    this.freeText = rawProps.freeText;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentDefault.VALIDATION_RULES,
    date: JoiValidationConstants.ISO_DATE.max('now').required(),
    freeText: JoiValidationConstants.STRING.max(1000).required(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return replaceBracketed(
      this.documentTitle,
      this.freeText,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    );
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeH.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeH.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeH =
  ExcludeMethods<CourtIssuedDocumentTypeH>;
