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
  public createStartDate: string;
  public createEndDate: string;
  public caseStatuses: CaseStatus[];
  public pageNumber: number;
  public pageSize: number;
  public caseTypes: CaseType[];
  public filingMethod: CustomCaseFilingMethods;

  constructor(rawProps) {
    super('CustomCaseInventorySearch');
    this.createStartDate = rawProps.createStartDate;
    this.createEndDate = rawProps.createEndDate;
    this.caseStatuses = rawProps.caseStatuses;
    this.pageNumber = rawProps.pageNumber;
    this.pageSize = rawProps.pageSize;
    this.caseTypes = rawProps.caseTypes;
    this.filingMethod = rawProps.filingMethod;
  }

  static VALIDATION_ERROR_MESSAGES = {
    createEndDate: [
      {
        contains: 'ref:createStartDate',
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
    createStartDate: [
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
      createEndDate: DATE_RANGE_VALIDATION_RULE_KEYS.endDate,
      createStartDate: DATE_RANGE_VALIDATION_RULE_KEYS.startDate,
      filingMethod: joi.string().valid(...CUSTOM_CASE_REPORT_FILING_METHODS),
      pageNumber: joi.number(),
      pageSize: joi.number(),
    };
  }
  getErrorToMessageMap() {
    return CustomCaseInventorySearch.VALIDATION_ERROR_MESSAGES;
  }
}
