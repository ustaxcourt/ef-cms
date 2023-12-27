import { DOCKET_ENTRY_VALIDATION_RULE_KEYS } from '@shared/business/entities/EntityValidationConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class DocketEntryWorksheet extends JoiValidationEntity {
  public docketEntryId: string;
  public finalBriefDueDate?: string;
  public primaryIssue?: string;
  public statusOfMatter?: string;

  constructor(rawProps) {
    super('DocketEntryWorksheet');

    this.docketEntryId = rawProps.docketEntryId;
    this.finalBriefDueDate = rawProps.finalBriefDueDate;
    this.primaryIssue = rawProps.primaryIssue;
    this.statusOfMatter = rawProps.statusOfMatter;
  }

  static STATUS_OF_MATTER_OPTIONS_DICTIONARY = {
    AwaitingBriefs: 'Awaiting Briefs',
    AwaitingConsideration: 'Awaiting Consideration',
    AwaitingRelease: 'Awaiting Release',
    Drafting: 'Drafting',
    ReviewingDraft: 'Reviewing Draft',
    RevisingDraft: 'Revising Draft',
    Stayed: 'Stayed',
    SubmittedToChiefJudge: 'Submitted to Chief Judge',
    SubmittedToReporter: 'Submitted to Reporter',
  };

  static VALIDATION_RULES = {
    docketEntryId: DOCKET_ENTRY_VALIDATION_RULE_KEYS.docketEntryId,
    finalBriefDueDate: JoiValidationConstants.DATE.allow('')
      .optional()
      .messages({
        '*': 'Enter a valid due date',
      }),
    primaryIssue: JoiValidationConstants.STRING.allow('').optional(),
    statusOfMatter: JoiValidationConstants.STRING.valid(
      ...Object.keys(DocketEntryWorksheet.STATUS_OF_MATTER_OPTIONS_DICTIONARY),
    )
      .allow(null)
      .optional(),
  };

  getValidationRules() {
    return DocketEntryWorksheet.VALIDATION_RULES;
  }
}

export type RawDocketEntryWorksheet = Omit<
  ExcludeMethods<DocketEntryWorksheet>,
  'entityName'
>;
