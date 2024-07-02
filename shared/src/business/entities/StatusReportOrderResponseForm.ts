import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class StatusReportOrderResponseForm extends JoiValidationEntity {
  public issueOrder?: string;
  public orderType?: string;
  public dueDate?: string;
  public strickenFromTrialSessions?: string;
  public jurisdiction?: string;
  public additionalOrderText?: string;
  public docketEntryDescription: string;

  constructor(rawProps) {
    super('StatusReportOrderResponseForm');

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
    additionalOrderText: JoiValidationConstants.STRING.max(80).optional(),
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
          .min(StatusReportOrderResponseForm.TODAY)
          .required()
          .description('When the status report or stipulated decision is due.'),
      })
      .messages({
        '*': 'Enter a valid date',
        'date.min': 'Due date cannot be prior to today. Enter a valid date.',
      }),
    issueOrder: JoiValidationConstants.STRING.valid(
      'allCasesInGroup',
      'justThisCase',
    )
      .optional()
      .allow(null),
    jurisdiction: JoiValidationConstants.STRING.valid(
      'retained',
      'restoredToGeneralDocket',
    )
      .when('strickenFromTrialSessions', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required().messages({
          'any.required':
            'Jurisdiction is required since case is stricken from the trial session',
        }),
      })
      .optional()
      .allow(null),
    orderType: JoiValidationConstants.STRING.valid(
      'statusReport',
      'orStipulatedDecision',
    )
      .optional()
      .allow(null),
  };

  getValidationRules() {
    return StatusReportOrderResponseForm.VALIDATION_RULES;
  }
}

export type RawStatusReportOrderResponseForm =
  ExcludeMethods<StatusReportOrderResponseForm>;
