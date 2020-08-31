const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { DOCKET_NUMBER_MATCHER } = require('../EntityConstants');

TrialSessionWorkingCopy.validationName = 'TrialSessionWorkingCopy';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function TrialSessionWorkingCopy() {}

TrialSessionWorkingCopy.prototype.init = function init(rawSession) {
  this.entityName = 'TrialSessionWorkingCopy';

  this.caseMetadata = rawSession.caseMetadata || {};
  this.filters = rawSession.filters || {
    aBasisReached: true,
    continued: true,
    dismissed: true,
    recall: true,
    rule122: true,
    setForTrial: true,
    settled: true,
    showAll: true,
    statusUnassigned: true,
    takenUnderAdvisement: true,
  };
  this.sessionNotes = rawSession.sessionNotes;
  this.sort = rawSession.sort;
  this.sortOrder = rawSession.sortOrder;
  this.trialSessionId = rawSession.trialSessionId;
  this.userId = rawSession.userId;
};

TrialSessionWorkingCopy.VALIDATION_ERROR_MESSAGES = {};

TrialSessionWorkingCopy.validationRules = {
  caseMetadata: joi
    .object()
    .pattern(
      DOCKET_NUMBER_MATCHER, // keys are docket numbers
      joi.object().keys({
        trialStatus: JoiValidationConstants.STRING.optional(),
      }),
    )
    .optional(),
  entityName: JoiValidationConstants.STRING.valid(
    'TrialSessionWorkingCopy',
  ).required(),
  filters: joi
    .object()
    .keys({
      aBasisReached: joi.boolean().required(),
      continued: joi.boolean().required(),
      dismissed: joi.boolean().required(),
      recall: joi.boolean().required(),
      rule122: joi.boolean().required(),
      setForTrial: joi.boolean().required(),
      settled: joi.boolean().required(),
      showAll: joi.boolean().required(),
      statusUnassigned: joi.boolean().required(),
      takenUnderAdvisement: joi.boolean().required(),
    })
    .required(),
  sessionNotes: JoiValidationConstants.STRING.optional(),
  sort: JoiValidationConstants.STRING.optional(),
  sortOrder: JoiValidationConstants.STRING.optional(),
  trialSessionId: JoiValidationConstants.UUID.required(),
  userId: JoiValidationConstants.UUID.required(),
};

joiValidationDecorator(
  TrialSessionWorkingCopy,
  joi.object().keys(TrialSessionWorkingCopy.validationRules),
  TrialSessionWorkingCopy.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  TrialSessionWorkingCopy: validEntityDecorator(TrialSessionWorkingCopy),
};
