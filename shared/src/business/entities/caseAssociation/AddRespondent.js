const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param {object} rawProps the metadata
 * @constructor
 */
function AddRespondent(rawProps) {
  Object.assign(this, {
    user: rawProps.user,
  });
}

AddRespondent.errorToMessageMap = {
  user: 'Select a respondent counsel',
};

AddRespondent.schema = joi.object().keys({
  user: joi.object().required(),
});

joiValidationDecorator(
  AddRespondent,
  AddRespondent.schema,
  undefined,
  AddRespondent.errorToMessageMap,
);

module.exports = { AddRespondent };
