const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const SESSION_TYPES = [
  'Regular',
  'Small',
  'Hybrid',
  'Special',
  'Motion/Hearing',
];

/**
 * constructor
 * @param rawSession
 * @constructor
 */
function TrialSession(rawSession) {
  Object.assign(this, {
    address1: rawSession.address1,
    address2: rawSession.address2,
    city: rawSession.city,
    courtReporter: rawSession.courtReporter,
    courthouseName: rawSession.courthouseName,
    createdAt: rawSession.createdAt || new Date().toISOString(),
    irsCalendarAdministrator: rawSession.irsCalendarAdministrator,
    judge: rawSession.judge,
    maxCases: rawSession.maxCases,
    notes: rawSession.notes,
    postalCode: rawSession.postalCode,
    sessionType: rawSession.sessionType,
    startDate: rawSession.startDate,
    startTime: rawSession.startTime,
    state: rawSession.state,
    swingSession: rawSession.swingSession,
    term: rawSession.term,
    trialClerk: rawSession.trialClerk,
    trialLocation: rawSession.trialLocation,
  });
}

TrialSession.errorToMessageMap = {
  maxCases: 'Enter number of cases allowed.',
  postalCode: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
  ],
  sessionType: 'Enter Session Type.',
  startDate: 'Enter Start Date.',
  term: 'Enter selection for Term.',
  trialLocation: 'Select a Trial Location.',
};

joiValidationDecorator(
  TrialSession,
  joi.object().keys({
    address1: joi.string().optional(),
    address2: joi.string().optional(),
    city: joi.string().optional(),
    courtReporter: joi.string().optional(),
    courthouseName: joi.string().optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    irsCalendarAdministrator: joi.string().optional(),
    judge: joi.string().optional(),
    maxCases: joi
      .number()
      .greater(0)
      .integer()
      .required(),
    notes: joi.string().optional(),
    postalCode: joi
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .optional(),
    sessionType: joi
      .string()
      .valid(SESSION_TYPES)
      .required(),
    startDate: joi
      .date()
      .iso()
      .min('now')
      .required(),
    state: joi.string().optional(),
    swingSession: joi.boolean().optional(),
    term: joi.string().required(),
    trialClerk: joi.string().optional(),
    trialLocation: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  TrialSession.errorToMessageMap,
);

module.exports = { TrialSession };
