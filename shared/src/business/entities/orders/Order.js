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
 * @param rawOrder
 * @constructor
 */
function Order(rawOrder) {
  this.documentTitle = rawOrder.documentTitle;
  this.documentType = rawOrder.documentType;
  this.orderBody = rawOrder.orderBody;
}

Order.errorToMessageMap = {
  documentTitle: 'Order title is required.',
  documentType: 'Order type is required.',
  orderBody: 'Order body is required.',
};

joiValidationDecorator(
  Order,
  joi.object().keys({
    documentTitle: joi.string().required(),
    documentType: joi.string().required(),
    orderBody: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Order.errorToMessageMap,
);

module.exports = { Order };
