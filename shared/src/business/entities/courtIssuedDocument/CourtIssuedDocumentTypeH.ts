import { CourtIssuedDocument } from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
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
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    date: JoiValidationConstants.ISO_DATE.max('now').required().messages({
      '*': 'Enter a date',
      'date.max': 'Enter a valid date',
      'date.min': 'Enter a valid date',
    }),
    freeText: JoiValidationConstants.STRING.max(1000).required().messages({
      'any.required': 'Enter a description',
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    }),
  };

  getValidationRules() {
    return CourtIssuedDocumentTypeH.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return replaceBracketed(
      this.documentTitle,
      this.freeText,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
    );
  }
}

export type RawCourtIssuedDocumentTypeH =
  ExcludeMethods<CourtIssuedDocumentTypeH>;
