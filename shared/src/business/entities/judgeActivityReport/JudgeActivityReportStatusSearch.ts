import { CavAndSubmittedCaseTypes } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class JudgeActivityReportStatusSearch extends JoiValidationEntity {
  public statuses: CavAndSubmittedCaseTypes;
  public judgesSelection: string[];

  constructor(rawProps) {
    super('JudgeActivityReportStatusSearch');
    this.judgesSelection = rawProps.judgesSelection;
    this.statuses = rawProps.statuses;
  }

  static VALIDATION_RULES = {
    judgesSelection:
      JoiValidationConstants.JUDGES_SELECTION.required().description(
        'The last names OR ids of judges',
      ),
    statuses: JoiValidationConstants.JUDGES_STATUSES.required().description(
      'The statuses of cases associated with selected judges',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
    judgesSelection: [
      {
        contains: 'is required',
        message: 'Judges Selection is a required field',
      },
      'Judges Selection must contain at least a name or id of a judge',
    ],
    statuses: [
      {
        contains: 'is required',
        message: 'CAV and Submitted fields are required',
      },
      'Cases statuses must contain at least a status selection',
    ],
  };

  getValidationRules() {
    return JudgeActivityReportStatusSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return JudgeActivityReportStatusSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawJudgeActivityReportStatusSearch =
  ExcludeMethods<JudgeActivityReportStatusSearch>;
