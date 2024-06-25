import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

export class StatusReportOrderResponseForm extends JoiValidationEntity {
  public issueOrder?: string;
  public orderType?: string;
  public dueDate?: string;
  public strikenFromTrialSessions?: string;
  public jurisdiction?: string;
  public additionalOrderText?: string;
  public docketEntryDescription: string;

  constructor(rawProps) {
    super('StatusReportOrderResponseForm');

    this.issueOrder = rawProps.issueOrder;
    this.orderType = rawProps.orderType;
    this.dueDate = rawProps.dueDate;
    this.strikenFromTrialSessions = rawProps.strikenFromTrialSessions;
    this.jurisdiction = rawProps.jurisdiction;
    this.additionalOrderText = rawProps.additionalOrderText;
    this.docketEntryDescription = rawProps.docketEntryDescription || 'Order';
  }
  static VALIDATION_RULES = joi.object().keys({
    additionalOrderText: JoiValidationConstants.STRING.max(80).optional(),
    docketEntryDescription: JoiValidationConstants.STRING.max(80).optional(),
    dueDate: JoiValidationConstants.ISO_DATE.when('orderType', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.required().messages({
        'any.required':
          'Due date is required for status reports and stipulated decisions',
      }),
    })
      .description('When the status report or stipulated decision is due.')
      .messages({
        '*': 'Enter a valid date',
      }),
    // TODO issueOrder radio button is only required if the case is a lead case
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
      .when('strikenFromTrialSessions', {
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
  });

  getValidationRules() {
    return StatusReportOrderResponseForm.VALIDATION_RULES;
  }
}

export type RawStatusReportOrderResponseForm =
  ExcludeMethods<StatusReportOrderResponseForm>;
