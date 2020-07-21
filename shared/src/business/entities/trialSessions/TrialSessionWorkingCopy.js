const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { DOCKET_NUMBER_MATCHER } = require('../EntityConstants');

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

TrialSessionWorkingCopy.prototype.init = function (rawSession) {
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
        trialStatus: joi.string().optional(),
      }),
    )
    .optional(),
  entityName: joi.string().valid('TrialSessionWorkingCopy').required(),
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
  sessionNotes: joi.string().optional(),
  sort: joi.string().optional(),
  sortOrder: joi.string().optional(),
  trialSessionId: JoiValidationConstants.UUID.required(),
  userId: JoiValidationConstants.UUID.required(),
};

joiValidationDecorator(
  TrialSessionWorkingCopy,
  joi.object().keys(TrialSessionWorkingCopy.validationRules),
  TrialSessionWorkingCopy.VALIDATION_ERROR_MESSAGES,
);

module.exports = { TrialSessionWorkingCopy };
