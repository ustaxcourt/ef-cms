import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';

export class CaseWorksheet extends JoiValidationEntity {
  public caseWorksheetId: string;
  public docketNumber: string;
  public finalBriefDueDate?: string;
  public primaryIssue?: string;
  public statusOfMatter?: string;

  constructor(rawProps, { applicationContext }) {
    super('CaseWorksheet');

    this.caseWorksheetId =
      rawProps.caseWorksheetId || applicationContext.getUniqueId();
    this.docketNumber = rawProps.docketNumber;
    this.finalBriefDueDate = rawProps.finalBriefDueDate;
    this.primaryIssue = rawProps.primaryIssue;
    this.statusOfMatter = rawProps.statusOfMatter;
  }

  static VALIDATION_RULES = {
    caseWorksheetId: JoiValidationConstants.UUID.required(),
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
