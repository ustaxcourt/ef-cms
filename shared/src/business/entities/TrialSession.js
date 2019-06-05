const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const uuidVersions = {
  version: ['uuidv4'],
};

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
    trialSessionId: rawSession.trialSessionId || uuid.v4(),
  });
}

TrialSession.errorToMessageMap = {
  maxCases: 'Enter the maximum number of cases allowed for this session.',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter a valid zip code.',
    },
  ],
  sessionType: 'Session type is required.',
  startDate: [
    {
      contains: 'must be larger than or equal to',
      message: 'Date must be in the future.',
    },
    'Date must be in correct format.',
  ],
  term: 'Term is required.',
  trialLocation: 'Trial Location is required.',
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
    trialSessionId: joi
      .string()
      .uuid(uuidVersions)
      .optional(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  TrialSession.errorToMessageMap,
);

module.exports = { TrialSession };
