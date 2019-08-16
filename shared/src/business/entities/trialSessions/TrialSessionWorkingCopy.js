const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('../cases/Case');

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
  this.caseMetadata = rawSession.caseMetadata || {};
  this.filters = rawSession.filters;
  this.sort = rawSession.sort;
  this.sortOrder = rawSession.sortOrder;
  this.trialSessionId = rawSession.trialSessionId;
  this.userId = rawSession.userId;
};

TrialSessionWorkingCopy.errorToMessageMap = {};

TrialSessionWorkingCopy.validationRules = {
  caseMetadata: joi
    .object()
    .pattern(
      Case.docketNumberMatcher, //keys are docket numbers
      joi.object().keys({
        notes: joi.string().optional(),
        trialStatus: joi.string().optional(),
      }),
    )
    .optional(),
  filters: joi.object().optional(),
  sort: joi.string().optional(),
  sortOrder: joi.string().optional(),
  trialSessionId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
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
