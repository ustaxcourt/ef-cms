import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class OrderWithoutBody extends JoiValidationEntity {
  public documentTitle: string;
  public documentType: string;
  public eventCode: string;

  constructor(rawOrder) {
    super('OrderWithoutBody');
    this.documentTitle = rawOrder.documentTitle;
    this.documentType = rawOrder.documentType;
    this.eventCode = rawOrder.eventCode;
  }

  getValidationRules() {
    return {
      documentTitle: JoiValidationConstants.STRING.max(100)
        .required()
        .messages({
          'any.required': 'Enter the title of this order',
          'string.max':
            'Limit is 100 characters. Enter 100 or fewer characters.',
        }),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .required()
        .messages({ '*': 'Select an order type' }),
      eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES)
        .required()
        .messages({ '*': 'Select an order type' }),
    };
  }
}

declare global {
  type RawOrderWithoutBody = ExcludeMethods<OrderWithoutBody>;
}
