import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { TRIAL_SESSION_SCOPE_TYPES } from '../EntityConstants';
import { getStandaloneRemoteDocumentTitle } from '../../utilities/getStandaloneRemoteDocumentTitle';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

export class CourtIssuedDocumentTypeF extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public freeText?: string;
  public judge: string;
  public judgeWithTitle?: string;
  public trialLocation: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeF');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.judge = rawProps.judge;
    this.judgeWithTitle = rawProps.judgeWithTitle;
    this.trialLocation = rawProps.trialLocation;
    this.freeText = rawProps.freeText;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).optional(),
    judge: JoiValidationConstants.STRING.required(),
    judgeWithtitle: JoiValidationConstants.STRING.optional(),
    trialLocation: JoiValidationConstants.STRING.required(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    const judge = this.judgeWithTitle || this.judge;

    if (this.trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
      this.documentTitle = getStandaloneRemoteDocumentTitle({
        documentTitle: this.documentTitle,
      });

      return replaceBracketed(this.documentTitle, judge, this.freeText);
    }

    return replaceBracketed(
      this.documentTitle,
      judge,
      this.trialLocation,
      this.freeText,
    );
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeF.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES_NEW,
    freeText: JoiValidationConstants.STRING.max(1000).optional().messages({
      'any.required': 'Enter a description',
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    }),
    judge: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessages('Select a judge'),
    ),
    judgeWithtitle: JoiValidationConstants.STRING.optional(),
    trialLocation: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessages('Select a trial location'),
    ),
  };

  getValidationRules_NEW() {
    return CourtIssuedDocumentTypeF.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeF.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeF =
  ExcludeMethods<CourtIssuedDocumentTypeF>;
