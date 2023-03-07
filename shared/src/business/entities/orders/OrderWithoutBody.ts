import { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } from '../EntityConstants';
import {
  IValidationEntity,
  TStaticValidationMethods,
  joiValidationDecorator,
  validEntityDecorator,
} from '../JoiValidationDecorator';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { Order } from './Order';
import joi from 'joi';

export class OrderWithoutBodyClass {
  public documentTitle: string;
  public documentType: string;
  public eventCode: string;

  constructor() {}

  init(rawOrder) {
    this.documentTitle = rawOrder.documentTitle;
    this.documentType = rawOrder.documentType;
    this.eventCode = rawOrder.eventCode;
  }

  static VALIDATION_ERROR_MESSAGES = {
    ...Order.VALIDATION_ERROR_MESSAGES,
  };
}

joiValidationDecorator(
  OrderWithoutBodyClass,
  joi.object().keys({
    documentTitle: JoiValidationConstants.STRING.max(100).required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).required(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
  }),
  OrderWithoutBodyClass.VALIDATION_ERROR_MESSAGES,
);

export const OrderWithoutBody: typeof OrderWithoutBodyClass &
  TStaticValidationMethods<RawWorkItem> = validEntityDecorator(
  OrderWithoutBodyClass,
);

declare global {
  type RawOrderWithoutBody = ExcludeMethods<OrderWithoutBodyClass>;
}
// eslint-disable-next-line no-redeclare
export interface WorkItemClass
  extends IValidationEntity<OrderWithoutBodyClass> {}
