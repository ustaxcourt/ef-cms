import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import {
  MAX_ORDER_RESPONSE_TEXT_CHARACTERS,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class MotionOrderResponseForm extends JoiValidationEntity {
  public motionOrderResponse?: string;
  public responseDate?: string;
  public additionalOrderText?: string;
  public dueDate?: string;
  public isOnLeadCase: boolean;
  public consolidatedGroupOrderFor: typeof MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor;

  constructor(rawProps) {
    super('MotionOrderResponseForm');

    this.motionOrderResponse = rawProps.motionOrderResponse;
    this.responseDate = rawProps.responseDate;
    this.additionalOrderText = rawProps.additionalOrderText;
    this.dueDate = rawProps.dueDate;
    this.isOnLeadCase = rawProps.isOnLeadCase;
    this.consolidatedGroupOrderFor = rawProps.consolidatedGroupOrderFor;
  }

  static TODAY = formatDateString(
    createISODateAtStartOfDayEST(),
    FORMATS.YYYYMMDD,
  );

  static VALIDATION_RULES = {
    additionalOrderText: joi
      .string()
      .optional()
      .max(MAX_ORDER_RESPONSE_TEXT_CHARACTERS)
      .allow(null, '')
      .description('Additional text for the response.')
      .messages({
        'string.max': 'Limit is 240 characters.',
      }),
    consolidatedGroupOrderFor: joi
      .when('isOnLeadCase', {
        is: joi.equal(true),
        then: joi
          .required()
          .valid(
            ...Object.values(
              MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor,
            ),
          ),
        otherwise: joi
          .required()
          .equal(
            MOTION_ORDER_RESPONSE_OPTIONS.consolidatedGroupOrderFor
              .THIS_CASE_ONLY,
          ),
      })
      .messages({ 'any.required': 'Select on which cases to file this order' }),
    dueDate: joi
      .when('motionOrderResponse', {
        is: joi.exist().not(null),
        then: joi
          .date()
          .iso()
          .format(['YYYY-MM-DD']) // expects format 'YYYY-MM-DD' != 'yyyy-MM-dd'
          .min(joi.ref('responseDate'))
          .required(),
        otherwise: joi.optional().allow(null),
      })
      .description('When the response is due.')
      .messages({
        'any.required':
          'Due Date is required when a Reply or Reply/SR is ordered',
        'date.format': 'Enter a valid date',
        'date.min':
          'Due date cannot be prior to response date. Enter a valid date.',
      }),
    motionOrderResponse: JoiValidationConstants.STRING.valid(
      ...Object.values(MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions),
    )
      .optional()
      .allow(null)
      .description('The type of response.')
      .messages({
        '*': 'Order reply must be one of [Order Reply, Order Reply/SR]',
      }),
    responseDate: joi
      .date()
      .iso()
      .format(['YYYY-MM-DD']) // expects format 'YYYY-MM-DD' != 'yyyy-MM-dd'
      .min(MotionOrderResponseForm.TODAY)
      .required()
      .description('When the response was filed.')
      .messages({
        'any.required': 'Response Date is required.',
        'date.format': 'Enter a valid date',
        'date.min':
          'Response Date cannot be prior to today. Enter a valid date.',
      }),
  };

  getValidationRules() {
    return MotionOrderResponseForm.VALIDATION_RULES;
  }
}

export type RawMotionOrderResponserForm =
  ExcludeMethods<MotionOrderResponseForm>;
