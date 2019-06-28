const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/* eslint-disable sort-keys-fix/sort-keys-fix */
// do we need the abbreviations?
const ORDER_TYPES = {
  O: 'Order',
  ODJ: 'Order of Dismissal for Lack of Jurisdiction',
  OD: 'Order of Dismissal',
  ODD: 'Order of Dismissal and Decision',
  OSC: 'Order to Show Cause',
  OAD: 'Order and Decision',
  DEC: 'Decision',
};
/* eslint-enable sort-keys-fix/sort-keys-fix */

/**
 * @param rawOrder
 * @constructor
 */
function Order(rawOrder) {
  Object.assign(this, {
    orderBody: rawOrder.orderBody,
    orderTitle: rawOrder.orderTitle,
    orderType: rawOrder.orderType,
  });
}

Order.errorToMessageMap = {
  orderBody: 'Order body is required.',
  orderTitle: 'Order title is required.',
  orderType: 'Order type is required.',
};

Order.ORDER_TYPES = ORDER_TYPES;

joiValidationDecorator(
  Order,
  joi.object().keys({
    orderBody: joi.string().required(),
    orderTitle: joi.string().required(),
    orderType: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Order.errorToMessageMap,
);

module.exports = { Order };
