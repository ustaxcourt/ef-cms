import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class StatusReportOrderForm extends JoiValidationEntity {
  public issueOrder?: string;
  public orderType?: string;
  public dueDate?: string;
  public strickenFromTrialSessions?: string;
  public jurisdiction?: string;
  public additionalOrderText?: string;
  public docketEntryDescription: string;

  constructor(rawProps) {
    super('StatusReportOrderForm');

    this.issueOrder = rawProps.issueOrder;
    this.orderType = rawProps.orderType;
    this.dueDate = rawProps.dueDate;
    this.strickenFromTrialSessions = rawProps.strickenFromTrialSessions;
    this.jurisdiction = rawProps.jurisdiction;
    this.additionalOrderText = rawProps.additionalOrderText;
    this.docketEntryDescription = rawProps.docketEntryDescription;
  }

  static TODAY = formatDateString(
    createISODateAtStartOfDayEST(),
    FORMATS.YYYYMMDD,
  );

  static VALIDATION_RULES = {
    additionalOrderText: JoiValidationConstants.STRING.max(256)
      .optional()
      .allow(null, ''),
    docketEntryDescription: JoiValidationConstants.STRING.max(80)
      .required()
      .messages({
        '*': 'Enter a docket entry description',
      }),
    dueDate: joi
      .when('orderType', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi
          .date()
          .iso()
          .format(['YYYY-MM-DD']) // expects format 'YYYY-MM-DD' != 'yyyy-MM-dd'
          .min(StatusReportOrderForm.TODAY)
          .required()
          .description('When the status report or stipulated decision is due.'),
      })
      .messages({
        'any.required':
          'Due date is required for status reports and stipulated decisions',
        'date.format': 'Enter a valid date',
        'date.min': 'Due date cannot be prior to today. Enter a valid date.',
      }),
    issueOrder: JoiValidationConstants.STRING.valid(
      STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
      STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.justThisCase,
    )
      .optional()
      .allow(null),
    jurisdiction: JoiValidationConstants.STRING.valid(
      STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.retained,
      STATUS_REPORT_ORDER_OPTIONS.jurisdictionOptions.restored,
    )
      .when('strickenFromTrialSessions', {
        is: joi.exist().not(null, false),
        otherwise: joi.optional().allow(null),
        then: joi.required().messages({
          'any.required':
            'Jurisdiction is required since case is stricken from the trial session',
        }),
      })
      .optional()
      .allow(null),
    orderType: JoiValidationConstants.STRING.valid(
      STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.statusReport,
      STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions.stipulatedDecision,
    )
      .optional()
      .allow(null),
  };

  getValidationRules() {
    return StatusReportOrderForm.VALIDATION_RULES;
  }
}

export type RawStatusReportOrderForm = ExcludeMethods<StatusReportOrderForm>;
