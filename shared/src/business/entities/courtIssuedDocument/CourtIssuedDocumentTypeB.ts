import { CourtIssuedDocument } from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
export class CourtIssuedDocumentTypeB extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public freeText?: string;
  public judge: string;
  public judgeWithTitle?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeB');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.freeText = rawProps.freeText;
    this.judge = rawProps.judge;
    this.judgeWithTitle = rawProps.judgeWithTitle;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).optional().messages({
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    }),
    judge: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a judge',
    }),
    judgeWithTitle: JoiValidationConstants.STRING.optional(),
  };

  getValidationRules() {
    return CourtIssuedDocumentTypeB.VALIDATION_RULES;
  }

  getDocumentTitle() {
    const judge = this.judgeWithTitle || this.judge;
    return replaceBracketed(this.documentTitle, judge, this.freeText);
  }
}

export type RawCourtIssuedDocumentTypeB =
  ExcludeMethods<CourtIssuedDocumentTypeB>;
