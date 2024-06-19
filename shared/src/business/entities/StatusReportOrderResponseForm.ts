import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

export class StatusReportOrderResponseForm extends JoiValidationEntity {
  public issueOrder?: string;
  public statusReportOrStipulatedDecision: string;
  public dueDate: string;
  public strikenFromTrialSessions: string;
  public jurisdiction: string;
  public additionalOrderText: string;
  public docketEntryDescription: string;

  constructor(rawProps) {
    super('StatusReportOrderResponseForm');

    this.issueOrder = rawProps.issueOrder;
    this.statusReportOrStipulatedDecision =
      rawProps.statusReportOrStipulatedDecision;
    this.dueDate = rawProps.dueDate;
    this.strikenFromTrialSessions = rawProps.strikenFromTrialSessions;
    this.jurisdiction = rawProps.jurisdiction;
    this.additionalOrderText = rawProps.additionalOrderText;
    this.docketEntryDescription = rawProps.docketEntryDescription;
  }
  static VALIDATION_RULES = joi.object().keys({
    // confirmPassword: joi
    //   .valid(joi.ref('password'))
    //   .required()
    //   .messages({ '*': 'Passwords must match' }),
    // email: JoiValidationConstants.EMAIL.required()
    //   .messages({
    //     '*': 'Enter a valid email address',
    //     'string.max': 'Email address must contain fewer than 100 characters',
    //   })
    //   .description('Email of user'),
    // entityName:
    //   JoiValidationConstants.STRING.valid('ChangePasswordForm').required(),
    // password: PASSWORD_RULE,

    // TODO issueOrder radio button is only required if the case is a lead case
    statusReportOrStipulatedDecision: JoiValidationConstants.STRING.valid([
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
