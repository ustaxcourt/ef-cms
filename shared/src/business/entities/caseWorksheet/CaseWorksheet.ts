import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class CaseWorksheet extends JoiValidationEntity {
  public docketNumber: string;
  public finalBriefDueDate?: string;
  public primaryIssue?: string;
  public statusOfMatter?: string;

  constructor(rawProps) {
    super('CaseWorksheet');

    this.docketNumber = rawProps.docketNumber;
    this.finalBriefDueDate = rawProps.finalBriefDueDate;
    this.primaryIssue = rawProps.primaryIssue;
    this.statusOfMatter = rawProps.statusOfMatter;
  }

  static STATUS_OF_MATTER_OPTIONS = [
    'Awaiting Consideration',
    'Awaiting Briefs',
    'Drafting',
    'Reviewing Draft',
    'Submitted to Chief Judge',
    'Revising Draft',
    'Submitted to Reporter',
    'Awaiting Release',
    'Stayed',
  ];

  static VALIDATION_RULES = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    finalBriefDueDate: JoiValidationConstants.DATE.allow('')
      .optional()
      .messages({
        '*': 'Enter a valid due date',
      }),
    primaryIssue: JoiValidationConstants.STRING.allow('').optional(),
    statusOfMatter: JoiValidationConstants.STRING.valid(
      ...CaseWorksheet.STATUS_OF_MATTER_OPTIONS,
    )
      .allow(null)
      .optional(),
  };

  getValidationRules() {
    return CaseWorksheet.VALIDATION_RULES;
  }
}

export type RawCaseWorksheet = ExcludeMethods<CaseWorksheet>;
