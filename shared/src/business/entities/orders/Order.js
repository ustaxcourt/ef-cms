const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } = require('../EntityConstants');

/**
 * @param {object} rawOrder the raw order data
 * @constructor
 */
function Order(rawOrder) {
  this.documentTitle = rawOrder.documentTitle;
  this.documentType = rawOrder.documentType;
  this.orderBody = rawOrder.orderBody;
}

Order.VALIDATION_ERROR_MESSAGES = {
  documentTitle: 'Enter the title of this order',
  documentType: 'Select an order type',
  eventCode: 'Select an order type',
  orderBody: 'Order body is required.',
};

Order.VALIDATION_RULES = {
  documentTitle: joi.string().max(100).required(),
  documentType: joi
    .string()
    .valid(...ALL_DOCUMENT_TYPES)
    .required(),
  eventCode: joi
    .string()
    .valid(...ALL_EVENT_CODES)
    .optional(),
  orderBody: joi.string().max(500).required(),
};

joiValidationDecorator(
  Order,
  joi.object().keys(Order.VALIDATION_RULES),
  Order.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Order };
