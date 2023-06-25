import { CAV_AND_SUBMITTED_CASE_STATUS_TYPES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class JudgeActivityReportCaseStatusSearch extends JoiValidationEntity {
  public statuses: CAV_AND_SUBMITTED_CASE_STATUS_TYPES;
  public judgeName: string;

  constructor(rawProps) {
    super('JudgeActivityReportCaseStatusSearch');
    this.judgeName = rawProps.judgeName;
    this.statuses = rawProps.statuses;
  }

  static VALIDATION_RULES = {
    judgeName: JoiValidationConstants.STRING.required().description(
      'The last names judges for searching for CAV and Submitted cases',
    ),
    statuses: JoiValidationConstants.JUDGES_STATUSES.required().description(
      'The CAV and Submitted case statuses associated with judges',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
    judgeName: [
      {
        contains: 'is required',
        message: 'Judge name is a required field',
      },
      'Judges Selection must contain at least a name a judge',
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
    return JudgeActivityReportCaseStatusSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return JudgeActivityReportCaseStatusSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawJudgeActivityReportCaseStatusSearch =
  ExcludeMethods<JudgeActivityReportCaseStatusSearch>;
