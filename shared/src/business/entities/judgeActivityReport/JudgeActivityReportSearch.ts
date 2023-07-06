import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';
const joi: Root = joiImported.extend(joiDate);
import { CAV_AND_SUBMITTED_CASE_STATUS_TYPES } from '../EntityConstants';
import {
  FORMATS,
  calculateISODate,
  createEndOfDayISO,
  createStartOfDayISO,
  isValidDateString,
} from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class JudgeActivityReportSearch extends JoiValidationEntity {
  private VALID_DATE_FORMAT: string = FORMATS.MMDDYYYY;

  public endDate: string;
  public startDate: string;
  public judgeName: string;
  public judgeId: string;
  public statuses: CAV_AND_SUBMITTED_CASE_STATUS_TYPES;
  public judges: string[];
  public pageSize: string;
  public searchAfter: number;

  protected tomorrow: string;

  constructor(rawProps) {
    super('JudgeActivityReportSearch');

    this.judgeId = rawProps.judgeId;
    this.judgeName = rawProps.judgeName;
    this.statuses = rawProps.statuses;
    this.judges = rawProps.judges;
    this.pageSize = rawProps.pageSize;
    this.searchAfter = rawProps.searchAfter;

    this.tomorrow = calculateISODate({
      howMuch: +1,
      units: 'days',
    });

    if (isValidDateString(rawProps.startDate, [this.VALID_DATE_FORMAT])) {
      const [month, day, year] = rawProps.startDate.split('/');
      this.startDate = createStartOfDayISO({
        day,
        month,
        year,
      });
    } else {
      this.startDate = rawProps.startDate;
    }

    if (isValidDateString(rawProps.endDate, [this.VALID_DATE_FORMAT])) {
      const [month, day, year] = rawProps.endDate.split('/');
      this.endDate = createEndOfDayISO({
        day,
        month,
        year,
      });
    } else {
      this.endDate = rawProps.endDate;
    }
  }

  static VALIDATION_RULES = {
    endDate: JoiValidationConstants.ISO_DATE.less(joi.ref('tomorrow'))
      .min(joi.ref('startDate'))
      .description(
        'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
      ),
    judgeId: joi
      .optional()
      .description('The userId of the judge to generate the report for'),
    judgeName: joi
      .optional()
      .description('The last name of the judge to generate the report for'),
    judges: joi
      .array()
      .items(joi.string())
      .description('The last names of judges to generate report for'),
    pageSize: joi
      .number()
      .optional()
      .description(
        'The page size for getting aggregated judge activity report for closed cases, opinions, orders issued  and sessions held',
      ),
    searchAfter: joi
      .number()
      .description(
        'The last docket number to be used to make the next set of calls per page number',
      ),
    startDate: JoiValidationConstants.ISO_DATE.max('now').description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    ),
    statuses: JoiValidationConstants.JUDGES_STATUSES.optional().description(
      'The CAV and Submitted case statuses associated with judges',
    ),
    tomorrow: JoiValidationConstants.STRING.optional().description(
      'The computed value to validate the endDate against, in order to verify that the endDate is less than or equal to the current date',
    ),
  };

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'ref:startDate',
        message:
          'End date cannot be prior to Start Date. Enter a valid end date.',
      },
      {
        contains: 'ref:tomorrow',
        message: 'End date cannot be in the future. Enter a valid date.',
      },
      {
        contains: 'is required',
        message: 'Enter an end date.',
      },
      'Enter a valid end date.',
    ],
    startDate: [
      {
        contains: 'is required',
        message: 'Enter a start date.',
      },
      {
        contains: 'must be less than or equal to',
        message: 'Start date cannot be in the future. Enter a valid date.',
      },
      'Enter a valid start date.',
    ],
  };

  getValidationRules() {
    return JudgeActivityReportSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return JudgeActivityReportSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawJudgeActivityReportSearch =
  ExcludeMethods<JudgeActivityReportSearch>;
