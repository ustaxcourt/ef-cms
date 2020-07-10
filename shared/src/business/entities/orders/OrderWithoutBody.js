const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { ALL_DOCUMENT_TYPES, ALL_EVENT_CODES } = require('../EntityConstants');
const { Order } = require('./Order');

/**
 * @param {object} rawOrder the raw order data
 * @constructor
 */
function OrderWithoutBody(rawOrder) {
  this.documentTitle = rawOrder.documentTitle;
  this.documentType = rawOrder.documentType;
  this.eventCode = rawOrder.eventCode;
}

OrderWithoutBody.VALIDATION_ERROR_MESSAGES = {
  ...Order.VALIDATION_ERROR_MESSAGES,
};

joiValidationDecorator(
  OrderWithoutBody,
  joi.object().keys({
    documentTitle: joi.string().max(100).required(),
    documentType: joi
      .string()
      .valid(...ALL_DOCUMENT_TYPES)
      .required(),
    eventCode: joi
      .string()
      .valid(...ALL_EVENT_CODES)
      .required(),
  }),
  OrderWithoutBody.VALIDATION_ERROR_MESSAGES,
);

module.exports = { OrderWithoutBody };
