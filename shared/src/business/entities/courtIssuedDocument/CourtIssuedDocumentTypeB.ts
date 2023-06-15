import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentDefault } from './CourtIssuedDocumentDefault';
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
    ...CourtIssuedDocumentDefault.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).optional(),
    judge: JoiValidationConstants.STRING.required(),
    judgeWithTitle: JoiValidationConstants.STRING.optional(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    const judge = this.judgeWithTitle || this.judge;
    return replaceBracketed(this.documentTitle, judge, this.freeText);
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeB.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeB.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeB =
  ExcludeMethods<CourtIssuedDocumentTypeB>;
