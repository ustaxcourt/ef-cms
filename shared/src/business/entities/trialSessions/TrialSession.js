const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../../utilities/DateHandler');

const COMMON_CITIES = [
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Mobile', state: 'Alabama' },
  { city: 'Anchorage', state: 'Alaska' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Little Rock', state: 'Arkansas' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'San Diego', state: 'California' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Hartford', state: 'Connecticut' },
  { city: 'Washington', state: 'District of Columbia' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Honolulu', state: 'Hawaii' },
  { city: 'Boise', state: 'Idaho' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Indianapolis', state: 'Indiana' },
  { city: 'Des Moines', state: 'Iowa' },
  { city: 'Louisville', state: 'Kentucky' },
  { city: 'New Orleans', state: 'Louisiana' },
  { city: 'Baltimore', state: 'Maryland' },
  { city: 'Boston', state: 'Massachusetts' },
  { city: 'Detroit', state: 'Michigan' },
  { city: 'St. Paul', state: 'Minnesota' },
  { city: 'Jackson', state: 'Mississippi' },
  { city: 'Kansas City', state: 'Missouri' },
  { city: 'St. Louis', state: 'Missouri' },
  { city: 'Helena', state: 'Montana' },
  { city: 'Omaha', state: 'Nebraska' },
  { city: 'Las Vegas', state: 'Nevada' },
  { city: 'Reno', state: 'Nevada' },
  { city: 'Albuquerque', state: 'New Mexico' },
  { city: 'Buffalo', state: 'New York' },
  { city: 'New York City', state: 'New York' },
  { city: 'Winston-Salem', state: 'North Carolina' },
  { city: 'Cincinnati', state: 'Ohio' },
  { city: 'Cleveland', state: 'Ohio' },
  { city: 'Columbus', state: 'Ohio' },
  { city: 'Oklahoma City', state: 'Oklahoma' },
  { city: 'Portland', state: 'Oregon' },
  { city: 'Philadelphia', state: 'Pennsylvania' },
  { city: 'Pittsburgh', state: 'Pennsylvania' },
  { city: 'Columbia', state: 'South Carolina' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'El Paso', state: 'Texas' },
  { city: 'Houston', state: 'Texas' },
  { city: 'Lubbock', state: 'Texas' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'Salt Lake City', state: 'Utah' },
  { city: 'Richmond', state: 'Virginia' },
  { city: 'Seattle', state: 'Washington' },
  { city: 'Spokane', state: 'Washington' },
  { city: 'Charleston', state: 'West Virginia' },
  { city: 'Milwaukee', state: 'Wisconsin' },
];

const SMALL_CITIES = [
  { city: 'Fresno', state: 'California' },
  { city: 'Tallahassee', state: 'Florida' },
  { city: 'Pocatello', state: 'Idaho' },
  { city: 'Peoria', state: 'Illinois' },
  { city: 'Wichita', state: 'Kansas' },
  { city: 'Shreveport', state: 'Louisiana' },
  { city: 'Portland', state: 'Maine' },
  { city: 'Billings', state: 'Montana' },
  { city: 'Albany', state: 'New York' },
  { city: 'Syracuse', state: 'New York' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Aberdeen', state: 'South Dakota' },
  { city: 'Burlington', state: 'Vermont' },
  { city: 'Roanoke', state: 'Virginia' },
  { city: 'Cheyenne', state: 'Wyoming' },
  ...COMMON_CITIES,
];

TrialSession.TRIAL_CITIES = {
  ALL: SMALL_CITIES,
  REGULAR: COMMON_CITIES,
  SMALL: SMALL_CITIES,
};

TrialSession.SESSION_TERMS = ['Winter', 'Fall', 'Spring'];

TrialSession.SESSION_TYPES = [
  'Regular',
  'Small',
  'Hybrid',
  'Special',
  'Motion/Hearing',
];

TrialSession.STATUS_TYPES = {
  closed: 'Closed',
  upcoming: 'Upcoming',
};

TrialSession.validationName = 'TrialSession';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function TrialSession(rawSession, { applicationContext }) {
  this.init(rawSession, { applicationContext });
}

TrialSession.prototype.init = function(rawSession, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.address1 = rawSession.address1;
  this.address2 = rawSession.address2;
  this.caseOrder = rawSession.caseOrder || [];
  this.city = rawSession.city;
  this.courtReporter = rawSession.courtReporter;
  this.courthouseName = rawSession.courthouseName;
  this.createdAt = rawSession.createdAt || createISODateString();
  this.irsCalendarAdministrator = rawSession.irsCalendarAdministrator;
  this.isCalendared = rawSession.isCalendared || false;
  this.judge = rawSession.judge;
  this.maxCases = rawSession.maxCases;
  this.notes = rawSession.notes;
  this.postalCode = rawSession.postalCode;
  this.sessionType = rawSession.sessionType;
  this.startDate = rawSession.startDate;
  this.startTime = rawSession.startTime || '10:00';
  this.state = rawSession.state;
  this.status = rawSession.status || TrialSession.STATUS_TYPES.upcoming;
  this.swingSession = rawSession.swingSession;
  this.swingSessionId = rawSession.swingSessionId;
  this.term = rawSession.term;
  this.termYear = rawSession.termYear;
  this.trialClerk = rawSession.trialClerk;
  this.trialLocation = rawSession.trialLocation;
  this.trialSessionId =
    rawSession.trialSessionId || applicationContext.getUniqueId();
};

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

TrialSession.validationRules = {
  COMMON: {
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
    isCalendared: joi.boolean().required(),
    judge: joi.object().optional(),
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
      .required(),
    startTime: joi.string().regex(/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/),
    state: joi.string().optional(),
    status: joi
      .string()
      .valid(
        Object.keys(TrialSession.STATUS_TYPES).map(
          key => TrialSession.STATUS_TYPES[key],
        ),
      ),
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
  },
};

joiValidationDecorator(
  TrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    caseOrder: joi.array().items(
      joi.object().keys({
        caseId: joi.string().uuid({
          version: ['uuidv4'],
        }),
      }),
    ),
    isCalendared: joi.boolean().required(),
    status: joi
      .string()
      .valid(
        Object.keys(TrialSession.STATUS_TYPES).map(
          key => TrialSession.STATUS_TYPES[key],
        ),
      ),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  TrialSession.errorToMessageMap,
);

/**
 *
 * @param {string} swingSessionId the id of the swing session to associate with the session
 * @returns {TrialSession} the trial session entity
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
  const { sessionType, trialLocation } = this;

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
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.setAsCalendared = function() {
  this.isCalendared = true;
  return this;
};

/**
 * add case to calendar
 *
 * @param {object} caseEntity the case entity to add to the calendar
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.addCaseToCalendar = function(caseEntity) {
  const { caseId } = caseEntity;
  this.caseOrder.push({ caseId });
  return this;
};

module.exports = { TrialSession };
