const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { TrialSession } = require('./TrialSession');

NewTrialSession.validationName = 'TrialSession';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function NewTrialSession(rawSession) {
  this.address1 = rawSession.address1;
  this.address2 = rawSession.address2;
  this.city = rawSession.city;
  this.courtReporter = rawSession.courtReporter;
  this.courthouseName = rawSession.courthouseName;
  this.createdAt = rawSession.createdAt || new Date().toISOString();
  this.irsCalendarAdministrator = rawSession.irsCalendarAdministrator;
  this.judge = rawSession.judge;
  this.maxCases = rawSession.maxCases;
  this.notes = rawSession.notes;
  this.postalCode = rawSession.postalCode;
  this.sessionType = rawSession.sessionType;
  this.startDate = rawSession.startDate;
  this.startTime = rawSession.startTime || '10:00';
  this.state = rawSession.state;
  this.swingSession = rawSession.swingSession;
  this.swingSessionId = rawSession.swingSessionId;
  this.term = rawSession.term;
  this.termYear = rawSession.termYear;
  this.trialClerk = rawSession.trialClerk;
  this.trialLocation = rawSession.trialLocation;
  this.trialSessionId = rawSession.trialSessionId || uuid.v4();
}

NewTrialSession.errorToMessageMap = {
  maxCases: 'Enter the maximum number of cases allowed for this session.',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter a valid ZIP code.',
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
  startTime: 'Start time value provided is invalid.',
  swingSessionId: 'You must select a swing session.',
  term: 'Term session is not valid.',
  termYear: 'Term year is required.',
  trialLocation: 'Trial Location is required.',
};

joiValidationDecorator(
  NewTrialSession,
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
    notes: joi
      .string()
      .max(400)
      .optional(),
    postalCode: joi
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .optional(),
    sessionType: joi
      .string()
      .valid(TrialSession.SESSION_TYPES)
      .required(),
    startDate: joi
      .date()
      .iso()
      .min('now')
      .required(),
    startTime: joi.string().regex(/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/),
    state: joi.string().optional(),
    swingSession: joi.boolean().optional(),
    swingSessionId: joi.when('swingSession', {
      is: true,
      otherwise: joi.string().optional(),
      then: joi
        .string()
        .uuid({
          version: ['uuidv4'],
        })
        .required(),
    }),
    term: joi
      .string()
      .valid(TrialSession.SESSION_TERMS)
      .required(),
    termYear: joi.string().required(),
    trialClerk: joi.string().optional(),
    trialLocation: joi.string().required(),
    trialSessionId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  NewTrialSession.errorToMessageMap,
);

module.exports = { NewTrialSession };
