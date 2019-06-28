const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * @param rawOrder
 * @constructor
 */
function OrderWithoutBody(rawOrder) {
  Object.assign(this, {
    orderTitle: rawOrder.orderTitle,
    orderType: rawOrder.orderType,
  });
}

OrderWithoutBody.errorToMessageMap = {
  orderTitle: 'Order title is required.',
  orderType: 'Order type is required.',
};

joiValidationDecorator(
  OrderWithoutBody,
  joi.object().keys({
    orderTitle: joi.string().required(),
    orderType: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  OrderWithoutBody.errorToMessageMap,
);

module.exports = { OrderWithoutBody };
