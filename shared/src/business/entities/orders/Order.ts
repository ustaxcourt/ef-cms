import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
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

  static VALIDATION_RULES = {
    documentTitle: JoiValidationConstants.STRING.max(100).required().messages({
      'any.required': 'Enter the title of this order',
      'string.max': 'Limit is 100 characters. Enter 100 or fewer characters.',
    }),
    documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
      .required()
      .messages({ '*': 'Select an order type' }),
    eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
      .optional()
      .messages({ '*': 'Select an order type' }),
    orderBody: JoiValidationConstants.STRING.max(500)
      .required()
      .messages({ '*': 'Order body is required.' }),
  };

  getValidationRules() {
    return Order.VALIDATION_RULES;
  }
}

declare global {
  type RawOrder = ExcludeMethods<Order>;
}
