const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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
  documentTitle: 'Enter the title of this order',
  documentType: 'Select an order type',
  eventCode: 'Select an order type',
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
