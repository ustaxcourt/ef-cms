import { CourtIssuedDocument } from './CourtIssuedDocumentConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class CourtIssuedDocumentTypeI extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle: string;
  public documentType: string;
  public eventCode: string;
  public filingDate?: string;
  public judge: string;
  public judgeWithTitle?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeI');
    this.affectedDocketEntries = rawProps.affectedDocketEntries;
    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.judge = rawProps.judge;
    this.judgeWithTitle = rawProps.judgeWithTitle;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocument.VALIDATION_RULES,
    judge: JoiValidationConstants.STRING.required().messages({
      '*': 'Select a judge',
    }),
    judgeWithTitle: JoiValidationConstants.STRING.optional(),
  };

  getValidationRules() {
    return CourtIssuedDocumentTypeI.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    const judge = this.judgeWithTitle || this.judge;
    return replaceBracketed(this.documentTitle, judge);
  }
}

export type RawCourtIssuedDocumentTypeI =
  ExcludeMethods<CourtIssuedDocumentTypeI>;
