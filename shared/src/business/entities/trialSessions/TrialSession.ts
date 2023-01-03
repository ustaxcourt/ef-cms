import { JoiValidationConstants } from '../JoiValidationConstants';
import {
  SESSION_STATUS_GROUPS,
  SESSION_STATUS_TYPES,
  SESSION_TERMS,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import {
  TValidationEntity,
  joiValidationDecorator,
  validEntityDecorator,
} from '../JoiValidationDecorator';
import { createISODateString } from '../../utilities/DateHandler';
import { isEmpty, isEqual } from 'lodash';
import joi from 'joi';

const stringRequiredForRemoteProceedings = JoiValidationConstants.STRING.max(
  100,
).when('isCalendared', {
  is: true,
  otherwise: joi.allow('').optional(),
  then: joi.when('proceedingType', {
    is: TRIAL_SESSION_PROCEEDING_TYPES.remote,
    otherwise: joi.allow('').optional(),
    then: joi.when('sessionScope', {
      is: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      otherwise: joi.optional(),
      then: joi.when('sessionType', {
        is: [SESSION_TYPES.special, SESSION_TYPES.motionHearing],
        otherwise: joi.required(),
        then: joi.allow('').optional(),
      }),
    }),
  }),
});

export type TJudge = {
  name: string;
  userId: string;
};

export type TTrialClerk = {
  name: string;
  userId: string;
};

export type TCaseOrder = {
  addedToSessionAt?: string;
  calendarNotes?: string;
  disposition?: string;
  docketNumber: string;
  isManuallyAdded?: boolean;
  removedFromTrial?: boolean;
  removedFromTrialDate?: string;
};

export class TrialSessionClass {
  public entityName: string;
  public address1: string;
  public address2: string;
  public alternateTrialClerkName: string;
  public caseOrder: TCaseOrder[];
  public chambersPhoneNumber: string;
  public city: string;
  public courtReporter: string;
  public courthouseName: string;
  public createdAt: string;
  public estimatedEndDate: string;
  public irsCalendarAdministrator: string;
  public isCalendared: boolean;
  public isClosed: boolean;
  public joinPhoneNumber: string;
  public maxCases: number;
  public meetingId: string;
  public notes: string;
  public noticeIssuedDate: string;
  public password: string;
  public postalCode: string;
  public sessionScope: string;
  public sessionType: string;
  public startDate: string;
  public startTime: string;
  public state: string;
  public swingSession: boolean;
  public swingSessionId: string;
  public term: string;
  public termYear: string;
  public trialLocation: string;
  public sessionStatus: string;
  public proceedingType: string;
  public trialSessionId: string;
  public judge: TJudge;
  public trialClerk: TTrialClerk;

  // this static method is later overwritten by the joi validation decorator
  static validateRawCollection<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trialSessions: T[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { applicationContext }: { applicationContext: IApplicationContext },
  ): T[] {
    return [];
  }

  static PROPERTIES_REQUIRED_FOR_CALENDARING = {
    [TRIAL_SESSION_PROCEEDING_TYPES.inPerson]: [
      'address1',
      'city',
      'state',
      'postalCode',
      'judge',
      'chambersPhoneNumber',
    ],
    [TRIAL_SESSION_PROCEEDING_TYPES.remote]: [
      'chambersPhoneNumber',
      'joinPhoneNumber',
      'meetingId',
      'password',
      'judge',
    ],
  };

  static VALIDATION_ERROR_MESSAGES = {
    estimatedEndDate: [
      {
        contains: 'must be greater than or equal to',
        message: 'Enter a valid estimated end date',
      },
      'Enter a valid estimated end date',
    ],
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

  static validationRules = {
    COMMON: {
      address1: JoiValidationConstants.STRING.max(100).allow('').optional(),
      address2: JoiValidationConstants.STRING.max(100).allow('').optional(),
      alternateTrialClerkName: joi.when('trialClerk', {
        is: joi.exist(),
        otherwise: JoiValidationConstants.STRING.max(100).allow('').optional(),
        then: joi.any().forbidden(),
      }),
      chambersPhoneNumber: stringRequiredForRemoteProceedings,
      city: JoiValidationConstants.STRING.max(100).allow('').optional(),
      courtReporter: JoiValidationConstants.STRING.max(100).optional(),
      courthouseName: JoiValidationConstants.STRING.max(100)
        .allow('')
        .optional(),
      createdAt: JoiValidationConstants.ISO_DATE.optional(),
      entityName:
        JoiValidationConstants.STRING.valid('TrialSession').required(),
      estimatedEndDate: JoiValidationConstants.ISO_DATE.optional()
        .min(joi.ref('startDate'))
        .allow(null),
      irsCalendarAdministrator:
        JoiValidationConstants.STRING.max(100).optional(),
      isCalendared: joi.boolean().required(),
      joinPhoneNumber: stringRequiredForRemoteProceedings,
      judge: joi
        .object({
          name: JoiValidationConstants.STRING.max(100).required(),
          userId: JoiValidationConstants.UUID.required(),
        })
        .optional(),
      maxCases: joi.when('sessionScope', {
        is: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        otherwise: joi.number().greater(0).integer().required(),
        then: joi.optional(),
      }),
      meetingId: stringRequiredForRemoteProceedings,
      notes: JoiValidationConstants.STRING.max(400).optional(),
      noticeIssuedDate: JoiValidationConstants.ISO_DATE.optional(),
      password: stringRequiredForRemoteProceedings,
      postalCode: JoiValidationConstants.US_POSTAL_CODE.allow('').optional(),
      proceedingType: JoiValidationConstants.STRING.valid(
        ...Object.values(TRIAL_SESSION_PROCEEDING_TYPES),
      ).required(),
      sessionScope: JoiValidationConstants.STRING.valid(
        ...Object.values(TRIAL_SESSION_SCOPE_TYPES),
      ).required(),
      sessionStatus: JoiValidationConstants.STRING.valid(
        ...Object.values(SESSION_STATUS_TYPES),
      ).required(),
      sessionType: JoiValidationConstants.STRING.valid(
        ...Object.values(SESSION_TYPES),
      ).required(),
      startDate: JoiValidationConstants.ISO_DATE.required(),
      startTime: JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES,
      state: JoiValidationConstants.STRING.valid(
        ...Object.keys(US_STATES),
        ...Object.keys(US_STATES_OTHER),
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
      trialLocation: joi.when('sessionScope', {
        is: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        otherwise: joi
          .alternatives()
          .try(
            JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
            JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
          )
          .required(),
        then: joi.optional(),
      }),
      trialSessionId: JoiValidationConstants.UUID.optional(),
    },
  };

  constructor(rawSession, { applicationContext }) {
    this.init(rawSession, { applicationContext });
  }

  init(rawSession, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }
    this.entityName = 'TrialSession';

    this.address1 = rawSession.address1;
    this.address2 = rawSession.address2;
    this.alternateTrialClerkName = rawSession.alternateTrialClerkName;
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
    this.sessionStatus = rawSession.sessionStatus || SESSION_STATUS_TYPES.new;
    this.estimatedEndDate = rawSession.estimatedEndDate || null;
    this.irsCalendarAdministrator = rawSession.irsCalendarAdministrator;
    this.isCalendared = rawSession.isCalendared || false;
    this.isClosed = rawSession.isClosed || false;
    this.joinPhoneNumber = rawSession.joinPhoneNumber;
    this.maxCases = rawSession.maxCases;
    this.meetingId = rawSession.meetingId;
    this.notes = rawSession.notes;
    this.noticeIssuedDate = rawSession.noticeIssuedDate;
    this.password = rawSession.password;
    this.postalCode = rawSession.postalCode;
    this.sessionScope =
      rawSession.sessionScope || TRIAL_SESSION_SCOPE_TYPES.locationBased;
    this.sessionType = rawSession.sessionType;
    this.startDate = rawSession.startDate;
    if (isStandaloneRemoteSession(rawSession.sessionScope)) {
      this.startTime = '13:00';
    } else {
      this.startTime = rawSession.startTime || '10:00';
    }
    this.state = rawSession.state;
    this.swingSession = rawSession.swingSession;
    this.swingSessionId = rawSession.swingSessionId;
    this.term = rawSession.term;
    this.termYear = rawSession.termYear;
    this.trialLocation = isStandaloneRemoteSession(rawSession.sessionScope)
      ? TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
      : rawSession.trialLocation;
    this.proceedingType = isStandaloneRemoteSession(rawSession.sessionScope)
      ? TRIAL_SESSION_PROCEEDING_TYPES.remote
      : rawSession.proceedingType;
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
  }
  /**
   *
   * @param {string} swingSessionId the id of the swing session to associate with the session
   * @returns {TrialSession} the trial session entity
   */
  setAsSwingSession(swingSessionId) {
    this.swingSessionId = swingSessionId;
    this.swingSession = true;
    return this;
  }

  /**
   * generate sort key prefix
   *
   * @returns {string} the sort key prefix
   */
  generateSortKeyPrefix() {
    const { sessionType, trialLocation } = this;
    const caseProcedureSymbol =
      {
        Regular: 'R',
        Small: 'S',
      }[sessionType] || 'H';

    const formattedTrialCity = trialLocation.replace(/[\s.,]/g, '');

    const skPrefix = [formattedTrialCity, caseProcedureSymbol].join('-');

    return skPrefix;
  }

  /**
   * set as calendared
   *
   * @returns {TrialSession} the trial session entity
   */
  setAsCalendared() {
    this.isCalendared = true;
    this.sessionStatus = SESSION_STATUS_TYPES.open;
    return this;
  }

  /**
   * add case to calendar
   *
   * @param {object} caseEntity the case entity to add to the calendar
   * @returns {TrialSession} the trial session entity
   */
  addCaseToCalendar(caseEntity) {
    const { docketNumber } = caseEntity;

    const caseExists = this.caseOrder.find(
      _caseOrder => _caseOrder.docketNumber === docketNumber,
    );

    if (!caseExists) {
      this.caseOrder.push({ docketNumber });
    }

    return this;
  }

  /**
   * manually add case to calendar
   *
   * @param {object} caseEntity the case entity to add to the calendar
   * @param {string} calendarNotes calendar notes for the case
   * @returns {TrialSession} the trial session entity
   */
  manuallyAddCaseToCalendar({ calendarNotes, caseEntity }) {
    const { docketNumber } = caseEntity;
    this.caseOrder.push({
      addedToSessionAt: createISODateString(),
      calendarNotes,
      docketNumber,
      isManuallyAdded: true,
    });
    return this;
  }

  /**
   * checks if a case is already on the session
   *
   * @param {object} caseEntity the case entity to check if already on the case
   * @returns {boolean} if the case is already on the trial session
   */
  isCaseAlreadyCalendared(caseEntity) {
    return !!this.caseOrder
      .filter(order => order.docketNumber === caseEntity.docketNumber)
      .filter(order => order.removedFromTrial !== true).length;
  }

  /**
   * set case as removedFromTrial
   *
   * @param {object} arguments the arguments object
   * @param {string} arguments.docketNumber the docketNumber of the case to remove from the calendar
   * @param {string} arguments.disposition the reason the case is being removed from the calendar
   * @returns {TrialSession} the trial session entity
   */
  removeCaseFromCalendar({ disposition, docketNumber }) {
    const caseToUpdate = this.caseOrder.find(
      trialCase => trialCase.docketNumber === docketNumber,
    );

    if (caseToUpdate) {
      caseToUpdate.disposition = disposition;
      caseToUpdate.removedFromTrial = true;
      caseToUpdate.removedFromTrialDate = createISODateString();
    }

    const allCases = this.caseOrder || [];
    const inactiveCases = allCases.filter(
      sessionCase => sessionCase.removedFromTrial === true,
    );

    if (
      this.sessionStatus === SESSION_STATUS_GROUPS.closed ||
      (!isEmpty(allCases) &&
        isEqual(allCases, inactiveCases) &&
        this.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote)
    ) {
      this.sessionStatus = SESSION_STATUS_GROUPS.closed;
    }

    return this;
  }

  /**
   * removes the case totally from the trial session
   *
   * @param {object} arguments the arguments object
   * @param {string} arguments.docketNumber the docketNumber of the case to remove from the calendar
   * @returns {TrialSession} the trial session entity
   */
  deleteCaseFromCalendar({ docketNumber }) {
    const index = this.caseOrder.findIndex(
      trialCase => trialCase.docketNumber === docketNumber,
    );
    if (index >= 0) {
      this.caseOrder.splice(index, 1);
    }
    return this;
  }

  /**
   * checks certain properties of the trial session for emptiness.
   * if one field is empty (via lodash.isEmpty), the method returns false
   *
   * @returns {boolean} TRUE if can set as calendared (properties were all not empty), FALSE otherwise
   */
  canSetAsCalendared() {
    return isEmpty(this.getEmptyFields());
  }

  /**
   * checks the trial session's proceedingType and returns true if it's remote
   *
   * @returns {boolean} TRUE if the proceedingType is remote; false otherwise
   */
  isRemote() {
    return this.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote;
  }

  /**
   * Returns certain properties of the trial session that are empty as a list.
   *
   * @returns {Array} A list of property names of the trial session that are empty
   */
  getEmptyFields() {
    const missingProperties =
      TrialSessionClass.PROPERTIES_REQUIRED_FOR_CALENDARING[
        this.proceedingType
      ].filter(property => isEmpty(this[property]));

    return missingProperties;
  }

  /**
   * Sets the notice issued date on the trial session
   *
   * @returns {TrialSession} the trial session entity
   */
  setNoticesIssued() {
    this.noticeIssuedDate = createISODateString();
    return this;
  }

  /**
   * set as closed
   *
   * @returns {TrialSession} the trial session entity
   */
  setAsClosed() {
    this.sessionStatus = SESSION_STATUS_TYPES.closed;
    return this;
  }
}

joiValidationDecorator(
  TrialSessionClass,
  joi.object().keys({
    ...TrialSessionClass.validationRules.COMMON,
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
  TrialSessionClass.VALIDATION_ERROR_MESSAGES,
);

/**
 * Determines if the scope of the trial session is standalone remote
 *
 * @param {object} arguments.sessionScope the session scope
 * @returns {Boolean} if the scope is a standalone remote session
 */
export const isStandaloneRemoteSession = function (sessionScope) {
  return sessionScope === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;
};

export const TrialSession: typeof TrialSessionClass =
  validEntityDecorator(TrialSessionClass);

// eslint-disable-next-line no-redeclare
export interface TrialSessionClass extends TValidationEntity {}
