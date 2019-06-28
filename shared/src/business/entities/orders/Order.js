const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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
