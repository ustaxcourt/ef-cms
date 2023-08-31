import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';

export class CaseWorksheet extends JoiValidationEntity {
  public docketNumber: string;
  public primaryIssue?: string;
  public statusOfMatter?: string;
  public finalBriefDueDate?: string;

  constructor(rawProps) {
    super('CaseWorksheet');

    this.docketNumber = rawProps.docketNumber;
    this.primaryIssue = rawProps.primaryIssue;
    this.statusOfMatter = rawProps.statusOfMatter;
    this.finalBriefDueDate = rawProps.finalBriefDueDate;
  }

  static VALIDATION_RULES = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    finalBriefDueDate: JoiValidationConstants.DATE.allow('').optional(),
    primaryIssue: JoiValidationConstants.STRING.optional(), // TODO: should this allow ''?
    statusOfMatter: JoiValidationConstants.STRING.valid(
      ...STATUS_OF_MATTER_OPTIONS,
    )
      .allow(null)
      .optional(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    finalBriefDueDate: 'Enter a valid due date',
    primaryIssue: 'Add primary issue', // TODO: should we change this error message?
  };

  getValidationRules() {
    return CaseWorksheet.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseWorksheet.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseWorksheet = ExcludeMethods<CaseWorksheet>;
