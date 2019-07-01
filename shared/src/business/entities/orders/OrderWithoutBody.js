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
    documentTitle: rawOrder.documentTitle,
    documentType: rawOrder.documentType,
  });
}

OrderWithoutBody.errorToMessageMap = {
  documentTitle: 'Order title is required.',
  documentType: 'Order type is required.',
};

joiValidationDecorator(
  OrderWithoutBody,
  joi.object().keys({
    documentTitle: joi.string().required(),
    documentType: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  OrderWithoutBody.errorToMessageMap,
);

module.exports = { OrderWithoutBody };
