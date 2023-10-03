import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

export class Order extends JoiValidationEntity {
  public documentTitle: string;
  public documentType: string;
  public orderBody: string;

  constructor(rawOrder: RawOrder) {
    super('Order');
    this.documentTitle = rawOrder.documentTitle;
    this.documentType = rawOrder.documentType;
    this.orderBody = rawOrder.orderBody;
  }

  static VALIDATION_ERROR_MESSAGES = {
    documentTitle: [
      { contains: 'is required', message: 'Enter the title of this order' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 100 characters. Enter 100 or fewer characters.',
      },
    ],
    documentType: 'Select an order type',
    eventCode: 'Select an order type',
    orderBody: 'Order body is required.',
  };

  static VALIDATION_RULES = {
    documentTitle: JoiValidationConstants.STRING.max(100).required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).required(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).optional(),
    orderBody: JoiValidationConstants.STRING.max(500).required(),
  };

  static VALIDATION_RULES_NEW = {
    documentTitle: JoiValidationConstants.STRING.max(100).required().messages({
      'any.required': 'Enter the title of this order',
      'string.max': 'Limit is 100 characters. Enter 100 or fewer characters.',
    }),
    documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .messages(setDefaultErrorMessages('Select an order type')),
    eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .optional()
      .messages(setDefaultErrorMessages('Select an order type')),
    orderBody: JoiValidationConstants.STRING.max(500)
      .required()
      .messages(setDefaultErrorMessages('Order body is required.')),
  };

  getValidationRules() {
    return Order.VALIDATION_RULES;
  }

  getValidationRules_NEW() {
    return Order.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return Order.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawOrder = ExcludeMethods<Order>;
}
