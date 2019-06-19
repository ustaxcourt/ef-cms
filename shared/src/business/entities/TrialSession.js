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

const STATUS_TYPES = {
  closed: 'Closed',
  upcoming: 'Upcoming',
};

const SESSION_TERMS = ['Winter', 'Fall', 'Spring'];

exports.STATUS_TYPES = STATUS_TYPES;

/**
 * constructor
 * @param rawSession
 * @constructor
 */
function TrialSession(rawSession) {
  Object.assign(this, {
    address1: rawSession.address1,
    address2: rawSession.address2,
    caseOrder: rawSession.caseOrder || [],
    city: rawSession.city,
    courtReporter: rawSession.courtReporter,
    courthouseName: rawSession.courthouseName,
    createdAt: rawSession.createdAt || new Date().toISOString(),
    irsCalendarAdministrator: rawSession.irsCalendarAdministrator,
    isCalendared: rawSession.isCalendared || false,
    judge: rawSession.judge,
    maxCases: rawSession.maxCases,
    notes: rawSession.notes,
    postalCode: rawSession.postalCode,
    sessionType: rawSession.sessionType,
    startDate: rawSession.startDate,
    startTime: rawSession.startTime || '10:00',
    state: rawSession.state,
    status: rawSession.status || STATUS_TYPES.upcoming,
    swingSession: rawSession.swingSession,
    swingSessionId: rawSession.swingSessionId,
    term: rawSession.term,
    termYear: rawSession.termYear,
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
  TrialSession,
  joi.object().keys({
    address1: joi.string().optional(),
    address2: joi.string().optional(),
    caseOrder: joi.array().items(
      joi.object().keys({
        caseId: joi.string().uuid(uuidVersions),
      }),
    ),
    city: joi.string().optional(),
    courtReporter: joi.string().optional(),
    courthouseName: joi.string().optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    irsCalendarAdministrator: joi.string().optional(),
    isCalendared: joi.boolean().required(),
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
      .valid(SESSION_TYPES)
      .required(),
    startDate: joi
      .date()
      .iso()
      .min('now')
      .required(),
    startTime: joi.string().regex(/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/),
    state: joi.string().optional(),
    status: joi
      .string()
      .valid(Object.keys(STATUS_TYPES).map(key => STATUS_TYPES[key])),
    swingSession: joi.boolean().optional(),
    swingSessionId: joi.when('swingSession', {
      is: true,
      otherwise: joi.string().optional(),
      then: joi
        .string()
        .uuid(uuidVersions)
        .required(),
    }),
    term: joi
      .string()
      .valid(SESSION_TERMS)
      .required(),
    termYear: joi.string().required(),
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

/**
 *
 * @param {string} swingSessionId
 * @returns {TrialSession}
 */
TrialSession.prototype.setAsSwingSession = function(swingSessionId) {
  this.swingSessionId = swingSessionId;
  this.swingSession = true;

  return this;
};

/**
 * generate sort key prefix
 *
 * @returns {string} the sort key prefix
 */
TrialSession.prototype.generateSortKeyPrefix = function() {
  const { trialLocation, sessionType } = this;

  const caseProcedureSymbol =
    {
      Regular: 'R',
      Small: 'S',
    }[sessionType] || 'H';

  const formattedTrialCity = trialLocation.replace(/[\s.,]/g, '');
  const skPrefix = [formattedTrialCity, caseProcedureSymbol].join('-');

  return skPrefix;
};

/**
 * set as calendared
 *
 * @returns {TrialSession}
 */
TrialSession.prototype.setAsCalendared = function() {
  this.isCalendared = true;
  return this;
};

/**
 * add case to calendar
 *
 * @param {Object} caseEntity
 * @returns {TrialSession}
 */
TrialSession.prototype.addCaseToCalendar = function(caseEntity) {
  const { caseId } = caseEntity;
  this.caseOrder.push({ caseId });
  return this;
};

exports.TrialSession = TrialSession;
