const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * Note entity
 *
 * @param {object} rawProps the raw note data
 * @constructor
 */
function PrimaryIssue() {
  this.entityName = 'PrimaryIssue';
}

PrimaryIssue.prototype.init = function (rawProps) {
  this.notes = rawProps.notes;
};

PrimaryIssue.VALIDATION_ERROR_MESSAGES = {
  notes: 'Add primary issue',
};

PrimaryIssue.schema = joi.object().keys({
  notes: JoiValidationConstants.STRING.required(),
});

joiValidationDecorator(
  PrimaryIssue,
  PrimaryIssue.schema,
  PrimaryIssue.VALIDATION_ERROR_MESSAGES,
);

module.exports = { PrimaryIssue: validEntityDecorator(PrimaryIssue) };
