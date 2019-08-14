const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

TrialSessionWorkingCopy.TRIAL_STATUS_TYPES = [
  'Set for Trial',
  'Dismissed',
  'Continued',
  'Rule 122',
  'A Basis Reached',
  'Settled',
  'Recall',
  'Taken Under Advisement',
];

TrialSessionWorkingCopy.validationName = 'TrialSessionWorkingCopy';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function TrialSessionWorkingCopy(rawSession) {
  this.init(rawSession);
}

TrialSessionWorkingCopy.prototype.init = function(rawSession) {
  this.caseMetadata = rawSession.caseMetadata;
  this.filters = rawSession.filters;
  this.sort = rawSession.sort;
  this.sortOrder = rawSession.sortOrder;
  this.trialSessionId = rawSession.trialSessionId;
  this.trialSessionWorkingCopyId =
    rawSession.trialSessionWorkingCopyId || uuid.v4();
  this.userId = rawSession.userId;
};

TrialSessionWorkingCopy.errorToMessageMap = {};

TrialSessionWorkingCopy.validationRules = {
  caseMetadata: joi.object().optional(),
  filters: joi.string().optional(),
  sort: joi.string().optional(),
  sortOrder: joi.string().optional(),
  trialSessionId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  trialSessionWorkingCopyId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .optional(),
  userId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
};

joiValidationDecorator(
  TrialSessionWorkingCopy,
  joi.object().keys(TrialSessionWorkingCopy.validationRules),
  function() {
    return !this.getFormattedValidationErrors();
  },
  TrialSessionWorkingCopy.errorToMessageMap,
);

module.exports = { TrialSessionWorkingCopy };
