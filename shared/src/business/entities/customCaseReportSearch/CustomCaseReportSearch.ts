import {
  CASE_STATUSES,
  CASE_TYPES,
  CaseStatus,
  CaseType,
} from '../EntityConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { createEndOfDayISO } from '@shared/business/utilities/DateHandler';
import joi from 'joi';

export const CUSTOM_CASE_REPORT_FILING_METHODS = [
  'all',
  'electronic',
  'paper',
] as const;
export type CustomCaseFilingMethods =
  (typeof CUSTOM_CASE_REPORT_FILING_METHODS)[number];

export const CUSTOM_CASE_REPORT_PROCEDURE_TYPES = [
  'All',
  'Regular',
  'Small',
] as const;
export type CustomCaseProcedureTypes =
  (typeof CUSTOM_CASE_REPORT_PROCEDURE_TYPES)[number];

export class CustomCaseReportSearch extends JoiValidationEntity {
  public caseStatuses: CaseStatus[];
  public caseTypes: CaseType[];
  public endDate: string;
  public filingMethod: CustomCaseFilingMethods;
  public highPriority: boolean;
  public judges: string[];
  public pageSize: number;
  public preferredTrialCities: string[];
  public procedureType: CustomCaseProcedureTypes;
  public searchAfter: {
    receivedAt: number;
    pk: string;
  };
  public startDate: string;

  constructor(rawProps) {
    super('CustomCaseReportSearch');
    this.caseStatuses = rawProps.caseStatuses;
    this.caseTypes = rawProps.caseTypes;
    this.endDate = rawProps.endDate;
    this.filingMethod = rawProps.filingMethod;
    this.highPriority = rawProps.highPriority;
    this.judges = rawProps.judges;
    this.pageSize = rawProps.pageSize;
    this.preferredTrialCities = rawProps.preferredTrialCities;
    this.procedureType = rawProps.procedureType;
    this.searchAfter = rawProps.searchAfter;
    this.startDate = rawProps.startDate;
  }

  getValidationRules() {
    return {
      caseStatuses: joi.array().items(joi.string().valid(...CASE_STATUSES)),
      caseTypes: joi.array().items(joi.string().valid(...CASE_TYPES)),
      endDate: joi
        .alternatives()
        .conditional('startDate', {
          is: JoiValidationConstants.ISO_DATE.exist().not(null),
          otherwise: JoiValidationConstants.ISO_DATE.max(
            createEndOfDayISO(),
          ).description(
            'The end date search filter must be of valid date format',
          ),
          then: JoiValidationConstants.ISO_DATE.max(createEndOfDayISO())
            .min(joi.ref('startDate'))
            .description(
              'The end date search filter must be of valid date format and greater than or equal to the start date',
            ),
        })
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.max': 'End date cannot be in the future. Enter a valid date.',
          'date.min':
            'End date cannot be prior to start date. Enter a valid end date.',
        }),
      filingMethod: joi
        .string()
        .valid(...CUSTOM_CASE_REPORT_FILING_METHODS)
        .required(),
      highPriority: joi.boolean(),
      judges: joi.array().items(joi.string()),
      pageSize: joi.number().required(),
      preferredTrialCities: joi.array().items(joi.string()),
      procedureType: joi
        .string()
        .valid(...CUSTOM_CASE_REPORT_PROCEDURE_TYPES)
        .required(),
      searchAfter: joi
        .object()
        .keys({
          pk: joi.string().allow('').required(),
          receivedAt: joi.number().required(),
        })
        .optional(),
      startDate: JoiValidationConstants.ISO_DATE.max('now')
        .description(
          'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
        )
        .messages({
          '*': 'Enter date in format MM/DD/YYYY.',
          'date.max': 'Start date cannot be in the future. Enter a valid date.',
        }),
    };
  }
}
