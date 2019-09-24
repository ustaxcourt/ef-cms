const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
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
    documentTitle: joi.string().required(),
    documentType: joi.string().required(),
    eventCode: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  OrderWithoutBody.VALIDATION_ERROR_MESSAGES,
);

module.exports = { OrderWithoutBody };
