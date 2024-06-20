import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

export class StatusReportOrderResponseForm extends JoiValidationEntity {
  public issueOrder?: string;
  public orderType: string;
  public dueDate: string;
  public strikenFromTrialSessions: string;
  public jurisdiction: string;
  public additionalOrderText: string;
  public docketEntryDescription: string;

  constructor(rawProps) {
    super('StatusReportOrderResponseForm');

    this.issueOrder = rawProps.issueOrder;
    this.orderType = rawProps.orderType;
    this.dueDate = rawProps.dueDate;
    this.strikenFromTrialSessions = rawProps.strikenFromTrialSessions;
    this.jurisdiction = rawProps.jurisdiction;
    this.additionalOrderText = rawProps.additionalOrderText;
    this.docketEntryDescription = rawProps.docketEntryDescription;
  }
  static VALIDATION_RULES = joi.object().keys({
    dueDate: JoiValidationConstants.ISO_DATE.when('orderType', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
      .description('When the status report or stipulated decision is due.')
      .messages({ '*': 'Enter a valid due date' }),
    // TODO issueOrder radio button is only required if the case is a lead case
    issueOrder: JoiValidationConstants.STRING.valid([
      'allCasesInGroup',
      'justThisCase',
    ]),
    jurisdiction: JoiValidationConstants.STRING.valid([
      'retained',
      'restoredToGeneralDocket',
    ]),
    orderType: JoiValidationConstants.STRING.valid([
      'statusReport',
      'orStipulatedDecision',
    ]),
  });

  getValidationRules() {
    return StatusReportOrderResponseForm.VALIDATION_RULES;
  }
}

export type RawStatusReportOrderResponseForm =
  ExcludeMethods<StatusReportOrderResponseForm>;
