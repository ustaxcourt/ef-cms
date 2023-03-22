import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { Order } from './Order';

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

  static VALIDATION_ERROR_MESSAGES = {
    ...Order.VALIDATION_ERROR_MESSAGES,
  };

  getValidationRules() {
    return {
      documentTitle: JoiValidationConstants.STRING.max(100).required(),
      documentType: JoiValidationConstants.STRING.valid(
        ...ALL_DOCUMENT_TYPES,
      ).required(),
      eventCode: JoiValidationConstants.STRING.valid(
        ...ALL_EVENT_CODES,
      ).required(),
    };
  }

  getErrorToMessageMap() {
    return OrderWithoutBody.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawOrderWithoutBody = ExcludeMethods<OrderWithoutBody>;
}
