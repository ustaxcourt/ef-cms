import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';

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

  static VALIDATION_RULES = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    finalBriefDueDate: JoiValidationConstants.DATE.allow('')
      .invalid(null)
      .optional(),
    primaryIssue: JoiValidationConstants.STRING.allow('').optional(),
    statusOfMatter: JoiValidationConstants.STRING.valid(
      ...STATUS_OF_MATTER_OPTIONS,
    )
      .allow(null)
      .optional(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    finalBriefDueDate: 'Enter a valid due date',
    primaryIssue: 'Add primary issue',
  };

  getValidationRules() {
    return CaseWorksheet.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CaseWorksheet.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCaseWorksheet = ExcludeMethods<CaseWorksheet>;
