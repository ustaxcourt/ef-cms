import { CAV_AND_SUBMITTED_CASE_STATUS_TYPES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';
export class JudgeActivityReportCaseStatusSearch extends JoiValidationEntity {
  public statuses: CAV_AND_SUBMITTED_CASE_STATUS_TYPES;
  public judges: string[];
  public pageSize: string;
  public searchAfter: number;

  constructor(rawProps) {
    super('JudgeActivityReportCaseStatusSearch');
    this.judges = rawProps.judges;
    this.statuses = rawProps.statuses;
    this.pageSize = rawProps.pageSize;
    this.searchAfter = rawProps.searchAfter;
  }

  static VALIDATION_RULES = {
    judges: joi
      .array()
      .items(joi.string())
      .required()
      .description(
        'The last names judges to generate reports for cav and submitted cases',
      ),
    pageSize: joi
      .number()
      .required()
      .description('The page size for getting cav and submitted cases'),
    searchAfter: joi
      .number()
      .required()
      .description(
        'The last docket number to be used to make the next set of calls per page number',
      ),
    statuses: JoiValidationConstants.JUDGES_STATUSES.required().description(
      'The CAV and Submitted case statuses associated with judges',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
    judges: [
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
