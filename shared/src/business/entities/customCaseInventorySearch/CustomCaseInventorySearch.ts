import {
  CASE_STATUSES,
  CASE_TYPES,
  CaseStatus,
  CaseType,
} from '../EntityConstants';
import { DATE_RANGE_VALIDATION_RULE_KEYS } from '../EntityValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import joi from 'joi';

/**
 * Custom Case Inventory Report Entity
 * @param {object} rawProps the raw activity search data
 * @constructor
 */
export const CUSTOM_CASE_REPORT_FILING_METHODS = [
  'all',
  'electronic',
  'paper',
] as const;
export type CustomCaseFilingMethods =
  (typeof CUSTOM_CASE_REPORT_FILING_METHODS)[number];

export class CustomCaseInventorySearch extends JoiValidationEntity {
  public startDate: string;
  public endDate: string;
  public caseStatuses: CaseStatus[];
  public pageSize: number;
  public caseTypes: CaseType[];
  public filingMethod: CustomCaseFilingMethods;
  public searchAfter: {
    receivedAt: number;
    pk: string;
  };

  constructor(rawProps) {
    super('CustomCaseInventorySearch');
    this.startDate = rawProps.startDate;
    this.endDate = rawProps.endDate;
    this.caseStatuses = rawProps.caseStatuses;
    this.pageSize = rawProps.pageSize;
    this.caseTypes = rawProps.caseTypes;
    this.filingMethod = rawProps.filingMethod;
    this.searchAfter = rawProps.searchAfter;
  }

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'ref:startDate',
        message:
          'End date cannot be prior to start date. Enter a valid end date.',
      },
      {
        contains: 'must be less than or equal to',
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
        contains: 'must be less than or equal to',
        message: 'Start date cannot be in the future. Enter a valid date.',
      },
      {
        contains: 'is required',
        message: 'Enter a start date.',
      },
      'Enter a valid start date.',
    ],
  };

  getValidationRules() {
    return {
      caseStatuses: joi.array().items(joi.string().valid(...CASE_STATUSES)),
      caseTypes: joi.array().items(joi.string().valid(...CASE_TYPES)),
      endDate: DATE_RANGE_VALIDATION_RULE_KEYS.endDate,
      filingMethod: joi
        .string()
        .valid(...CUSTOM_CASE_REPORT_FILING_METHODS)
        .required(),
      pageSize: joi.number().required(),
      searchAfter: joi
        .object()
        .keys({
          pk: joi.string().allow('').required(),
          receivedAt: joi.number().required(),
        })
        .required(),
      startDate: DATE_RANGE_VALIDATION_RULE_KEYS.startDate,
    };
  }
  getErrorToMessageMap() {
    return CustomCaseInventorySearch.VALIDATION_ERROR_MESSAGES;
  }
}
