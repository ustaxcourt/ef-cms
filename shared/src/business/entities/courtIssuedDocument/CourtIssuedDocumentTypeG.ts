import {
  CourtIssuedDocument,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { TRIAL_SESSION_SCOPE_TYPES } from '../EntityConstants';
import { getStandaloneRemoteDocumentTitle } from '../../utilities/getStandaloneRemoteDocumentTitle';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class CourtIssuedDocumentTypeG extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public date: string;
  public trialLocation: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeG');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.date = rawProps.date;
    this.trialLocation = rawProps.trialLocation;
  }

  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    date: JoiValidationConstants.ISO_DATE.required(),
    trialLocation: JoiValidationConstants.STRING.required(),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    if (this.trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
      this.documentTitle = getStandaloneRemoteDocumentTitle({
        documentTitle: this.documentTitle,
      });

      return replaceBracketed(
        this.documentTitle,
        formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
      );
    }

    return replaceBracketed(
      this.documentTitle,
      formatDateString(this.date, FORMATS.MMDDYYYY_DASHED),
      this.trialLocation,
    );
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeG.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeG.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeG =
  ExcludeMethods<CourtIssuedDocumentTypeG>;
