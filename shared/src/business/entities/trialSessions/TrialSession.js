const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  SESSION_TERMS,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
  TRIAL_SESSION_PROCEEDING_TYPES,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const { createISODateString } = require('../../utilities/DateHandler');
const { isEmpty } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function TrialSession(rawSession, { applicationContext }) {
  this.init(rawSession, { applicationContext });
}

TrialSession.prototype.init = function (rawSession, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'TrialSession';

  this.address1 = rawSession.address1;
  this.address2 = rawSession.address2;
  this.caseOrder = (rawSession.caseOrder || []).map(caseOrder => ({
    addedToSessionAt: caseOrder.addedToSessionAt,
    calendarNotes: caseOrder.calendarNotes,
    disposition: caseOrder.disposition,
    docketNumber: caseOrder.docketNumber,
    isManuallyAdded: caseOrder.isManuallyAdded,
    removedFromTrial: caseOrder.removedFromTrial,
    removedFromTrialDate: caseOrder.removedFromTrialDate,
  }));
  this.chambersPhoneNumber = rawSession.chambersPhoneNumber;
  this.city = rawSession.city;
  this.courtReporter = rawSession.courtReporter;
  this.courthouseName = rawSession.courthouseName;
  this.createdAt = rawSession.createdAt || createISODateString();
  this.irsCalendarAdministrator = rawSession.irsCalendarAdministrator;
  this.isCalendared = rawSession.isCalendared || false;
  this.joinPhoneNumber = rawSession.joinPhoneNumber;
  this.maxCases = rawSession.maxCases;
  this.meetingId = rawSession.meetingId;
  this.notes = rawSession.notes;
  this.noticeIssuedDate = rawSession.noticeIssuedDate;
  this.password = rawSession.password;
  this.postalCode = rawSession.postalCode;
  this.sessionType = rawSession.sessionType;
  this.startDate = rawSession.startDate;
  this.startTime = rawSession.startTime || '10:00';
  this.state = rawSession.state;
  this.swingSession = rawSession.swingSession;
  this.swingSessionId = rawSession.swingSessionId;
  this.term = rawSession.term;
  this.termYear = rawSession.termYear;
  this.trialLocation = rawSession.trialLocation;
  this.proceedingType = rawSession.proceedingType;
  this.trialSessionId =
    rawSession.trialSessionId || applicationContext.getUniqueId();

  if (rawSession.judge && rawSession.judge.name) {
    this.judge = {
      name: rawSession.judge.name,
      userId: rawSession.judge.userId,
    };
  }

  if (rawSession.trialClerk && rawSession.trialClerk.name) {
    this.trialClerk = {
      name: rawSession.trialClerk.name,
      userId: rawSession.trialClerk.userId,
    };
  }
};

TrialSession.VALIDATION_ERROR_MESSAGES = {
  maxCases: 'Enter a valid number of maximum cases',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter ZIP code',
    },
  ],
  proceedingType: 'Enter a valid proceeding type',
  sessionType: 'Select a session type',
  startDate: [
    {
      contains: 'must be greater than or equal to',
      message: 'Enter a valid start date',
    },
    'Enter a valid start date',
  ],
  startTime: 'Enter a valid start time',
  swingSessionId: 'You must select a swing session',
  term: 'Term session is not valid',
  termYear: 'Term year is required',
  trialLocation: 'Select a trial session location',
};

TrialSession.PROPERTIES_REQUIRED_FOR_CALENDARING = {
  [TRIAL_SESSION_PROCEEDING_TYPES.inPerson]: [
    'address1',
    'city',
    'state',
    'postalCode',
    'judge',
  ],
  [TRIAL_SESSION_PROCEEDING_TYPES.remote]: [
    'chambersPhoneNumber',
    'joinPhoneNumber',
    'meetingId',
    'password',
    'judge',
  ],
};

const stringRequiredForRemoteProceedings = JoiValidationConstants.STRING.max(
  100,
).when('isCalendared', {
  is: true,
  otherwise: joi.allow('').optional(),
  then: joi.when('proceedingType', {
    is: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    otherwise: joi.allow('').optional(),
    then: joi.when('sessionType', {
      is: [SESSION_TYPES.special, SESSION_TYPES.motionHearing],
      otherwise: joi.required(),
      then: joi.allow('').optional(),
    }),
  }),
});

TrialSession.validationRules = {
  COMMON: {
    address1: JoiValidationConstants.STRING.max(100).allow('').optional(),
    address2: JoiValidationConstants.STRING.max(100).allow('').optional(),
    chambersPhoneNumber: stringRequiredForRemoteProceedings,
    city: JoiValidationConstants.STRING.max(100).allow('').optional(),
    courtReporter: JoiValidationConstants.STRING.max(100).optional(),
    courthouseName: JoiValidationConstants.STRING.max(100).allow('').optional(),
    createdAt: JoiValidationConstants.ISO_DATE.optional(),
    entityName: JoiValidationConstants.STRING.valid('TrialSession').required(),
    irsCalendarAdministrator: JoiValidationConstants.STRING.max(100).optional(),
    isCalendared: joi.boolean().required(),
    joinPhoneNumber: stringRequiredForRemoteProceedings,
    judge: joi
      .object({
        name: JoiValidationConstants.STRING.max(100).required(),
        userId: JoiValidationConstants.UUID.required(),
      })
      .optional(),
    maxCases: joi.number().greater(0).integer().required(),
    meetingId: stringRequiredForRemoteProceedings,
    notes: JoiValidationConstants.STRING.max(400).optional(),
    noticeIssuedDate: JoiValidationConstants.ISO_DATE.optional(),
    password: stringRequiredForRemoteProceedings,
    postalCode: JoiValidationConstants.US_POSTAL_CODE.allow('').optional(),
    proceedingType: JoiValidationConstants.STRING.valid(
      ...Object.values(TRIAL_SESSION_PROCEEDING_TYPES),
    ).required(),
    sessionType: JoiValidationConstants.STRING.valid(
      ...Object.values(SESSION_TYPES),
    ).required(),
    startDate: JoiValidationConstants.ISO_DATE.required(),
    startTime: JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES,
    state: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...US_STATES_OTHER,
    )
      .allow('')
      .optional(),
    swingSession: joi.boolean().optional(),
    swingSessionId: JoiValidationConstants.UUID.when('swingSession', {
      is: true,
      otherwise: JoiValidationConstants.STRING.optional(),
      then: joi.required(),
    }),
    term: JoiValidationConstants.STRING.valid(...SESSION_TERMS).required(),
    termYear: JoiValidationConstants.STRING.max(4).required(),
    trialClerk: joi
      .object({
        name: JoiValidationConstants.STRING.max(100).required(),
        userId: JoiValidationConstants.UUID.required(),
      })
      .optional(),
    trialLocation: joi
      .alternatives()
      .try(
        JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
        JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .required(),
    trialSessionId: JoiValidationConstants.UUID.optional(),
  },
};

joiValidationDecorator(
  TrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    caseOrder: joi.array().items(
      joi.object().keys({
        calendarNotes: JoiValidationConstants.STRING.max(200)
          .optional()
          .allow('', null),
        disposition: JoiValidationConstants.STRING.max(100).when(
          'removedFromTrial',
          {
            is: true,
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
        docketNumber:
          JoiValidationConstants.DOCKET_NUMBER.required().description(
            'Docket number of the case.',
          ),
        isManuallyAdded: joi.boolean().optional(),
        removedFromTrial: joi.boolean().optional(),
        removedFromTrialDate: JoiValidationConstants.ISO_DATE.when(
          'removedFromTrial',
          {
            is: true,
            otherwise: joi.optional().allow(null),
            then: joi.required(),
          },
        ),
      }),
    ),
  }),
  TrialSession.VALIDATION_ERROR_MESSAGES,
);

/**
 *
 * @param {string} swingSessionId the id of the swing session to associate with the session
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.setAsSwingSession = function (swingSessionId) {
  this.swingSessionId = swingSessionId;
  this.swingSession = true;
  return this;
};

/**
 * generate sort key prefix
 *
 * @returns {string} the sort key prefix
 */
TrialSession.prototype.generateSortKeyPrefix = function () {
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
TrialSession.prototype.setAsCalendared = function () {
  this.isCalendared = true;
  return this;
};

/**
 * add case to calendar
 *
 * @param {object} caseEntity the case entity to add to the calendar
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.addCaseToCalendar = function (caseEntity) {
  const { docketNumber } = caseEntity;

  const caseExists = this.caseOrder.find(
    _caseOrder => _caseOrder.docketNumber === docketNumber,
  );

  if (!caseExists) {
    this.caseOrder.push({ docketNumber });
  }

  return this;
};

/**
 * manually add case to calendar
 *
 * @param {object} caseEntity the case entity to add to the calendar
 * @param {string} calendarNotes calendar notes for the case
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.manuallyAddCaseToCalendar = function ({
  calendarNotes,
  caseEntity,
}) {
  const { docketNumber } = caseEntity;
  this.caseOrder.push({
    addedToSessionAt: createISODateString(),
    calendarNotes,
    docketNumber,
    isManuallyAdded: true,
  });
  return this;
};

/**
 * checks if a case is already on the session
 *
 * @param {object} caseEntity the case entity to check if already on the case
 * @returns {boolean} if the case is already on the trial session
 */
TrialSession.prototype.isCaseAlreadyCalendared = function (caseEntity) {
  return !!this.caseOrder
    .filter(order => order.docketNumber === caseEntity.docketNumber)
    .filter(order => order.removedFromTrial !== true).length;
};

/**
 * set case as removedFromTrial
 *
 * @param {object} arguments the arguments object
 * @param {string} arguments.docketNumber the docketNumber of the case to remove from the calendar
 * @param {string} arguments.disposition the reason the case is being removed from the calendar
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.removeCaseFromCalendar = function ({
  disposition,
  docketNumber,
}) {
  const caseToUpdate = this.caseOrder.find(
    trialCase => trialCase.docketNumber === docketNumber,
  );
  if (caseToUpdate) {
    caseToUpdate.disposition = disposition;
    caseToUpdate.removedFromTrial = true;
    caseToUpdate.removedFromTrialDate = createISODateString();
  }
  return this;
};

/**
 * removes the case totally from the trial session
 *
 * @param {object} arguments the arguments object
 * @param {string} arguments.docketNumber the docketNumber of the case to remove from the calendar
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.deleteCaseFromCalendar = function ({ docketNumber }) {
  const index = this.caseOrder.findIndex(
    trialCase => trialCase.docketNumber === docketNumber,
  );
  if (index >= 0) {
    this.caseOrder.splice(index, 1);
  }
  return this;
};

/**
 * checks certain properties of the trial session for emptiness.
 * if one field is empty (via lodash.isEmpty), the method returns false
 *
 * @returns {boolean} TRUE if can set as calendared (properties were all not empty), FALSE otherwise
 */
TrialSession.prototype.canSetAsCalendared = function () {
  return isEmpty(this.getEmptyFields());
};

/**
 * Returns certain properties of the trial session that are empty as a list.
 *
 * @returns {Array} A list of property names of the trial session that are empty
 */
TrialSession.prototype.getEmptyFields = function () {
  const missingProperties = TrialSession.PROPERTIES_REQUIRED_FOR_CALENDARING[
    this.proceedingType
  ].filter(property => isEmpty(this[property]));

  return missingProperties;
};

/**
 * Sets the notice issued date on the trial session
 *
 * @returns {TrialSession} the trial session entity
 */
TrialSession.prototype.setNoticesIssued = function () {
  this.noticeIssuedDate = createISODateString();
  return this;
};

module.exports = { TrialSession: validEntityDecorator(TrialSession) };
