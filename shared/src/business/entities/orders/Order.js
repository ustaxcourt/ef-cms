const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

Order.ORDER_TYPES = [
  {
    documentType: 'Order',
    eventCode: 'O',
  },
  {
    documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
    documentType: 'Order of Dismissal for Lack of Jurisdiction',
    eventCode: 'ODJ',
  },
  {
    documentTitle: 'Order of Dismissal',
    documentType: 'Order of Dismissal',
    eventCode: 'OD',
  },
  {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
  },
  {
    documentTitle: 'Order to Show Cause',
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  {
    documentTitle: 'Order and Decision',
    documentType: 'Order and Decision',
    eventCode: 'OAD',
  },
  {
    documentTitle: 'Decision',
    documentType: 'Decision',
    eventCode: 'DEC',
  },
];

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

joiValidationDecorator(
  Order,
  joi.object().keys({
    documentTitle: joi.string().required(),
    documentType: joi.string().required(),
    eventCode: joi.string().optional(),
    orderBody: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Order.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Order };
