import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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
      .optional()
      .messages({
        ...setDefaultErrorMessage('Enter a valid due date'),
      }),
    primaryIssue: JoiValidationConstants.STRING.allow('').optional(),
    statusOfMatter: JoiValidationConstants.STRING.valid(
      ...STATUS_OF_MATTER_OPTIONS,
    )
      .allow(null)
      .optional(),
  };

  getValidationRules() {
    return CaseWorksheet.VALIDATION_RULES;
  }
}

export type RawCaseWorksheet = ExcludeMethods<CaseWorksheet>;
