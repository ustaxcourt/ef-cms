/* eslint-disable complexity */
import {
  FORMATS,
  createISODateString,
  formatDateString,
  isTodayWithinGivenInterval,
  prepareDateFromString,
} from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import {
  SESSION_STATUS_GROUPS,
  SESSION_STATUS_TYPES,
  SESSION_TERMS,
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TrialSessionProceedingType,
  TrialSessionScope,
  US_STATES,
  US_STATES_OTHER,
} from '../EntityConstants';
import { isEmpty, isEqual } from 'lodash';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

// TODO 9970: Can we reduce some complexity here? CalendaredTrialSession..?

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

export class TrialSession extends JoiValidationEntity {
  public address1?: string;
  public address2?: string;
  public alternateTrialClerkName?: string;
  public caseOrder?: TCaseOrder[];
  public chambersPhoneNumber?: string;
  public city?: string;
  public courthouseName?: string;
  public courtReporter?: string;
  public createdAt?: string;
  public dismissedAlertForNOTT?: boolean;
  public hasNOTTBeenServed: boolean;
  public estimatedEndDate?: string;
  public irsCalendarAdministrator?: string;
  public isCalendared: boolean;
  public isClosed?: boolean;
  public isStartDateWithinNOTTReminderRange?: boolean;
  public joinPhoneNumber?: string;
  public judge?: TJudge;
  public maxCases?: number;
  public meetingId?: string;
  public notes?: string;
  public noticeIssuedDate?: string;
  public password?: string;
  public postalCode?: string;
  public proceedingType: TrialSessionProceedingType;
  public sessionScope: TrialSessionScope;
  public sessionStatus: string;
  public sessionType: string;
  public startDate: string;
  public startTime?: string;
  public state?: string;
  public swingSession?: boolean;
  public swingSessionId?: string;
  public term: string;
  public termYear: string;
  public thirtyDaysBeforeTrialFormatted?: string;
  public trialClerk?: TTrialClerk;
  public trialLocation?: string;
  public trialSessionId?: string;

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
  } as const;

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
      dismissedAlertForNOTT: joi.boolean().optional(),
      entityName:
        JoiValidationConstants.STRING.valid('TrialSession').required(),
      estimatedEndDate: joi.when('startDate', {
        is: JoiValidationConstants.ISO_DATE.required(),
        otherwise: joi.optional(),
        then: JoiValidationConstants.ISO_DATE.min(joi.ref('startDate'))
          .optional()
          .allow(null),
      }),
      hasNOTTBeenServed: joi.boolean().required(),
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
    super('TrialSession');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

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
    this.dismissedAlertForNOTT = rawSession.dismissedAlertForNOTT || false;
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
    this.hasNOTTBeenServed = rawSession.hasNOTTBeenServed || false;
    this.sessionScope =
      rawSession.sessionScope || TRIAL_SESSION_SCOPE_TYPES.locationBased;
    this.sessionType = rawSession.sessionType;
    this.startDate = rawSession.startDate;
    if (this.isStandaloneRemote()) {
      this.startTime = '13:00';
    } else {
      this.startTime = rawSession.startTime || '10:00';
    }
    this.state = rawSession.state;
    this.swingSession = rawSession.swingSession;
    this.swingSessionId = rawSession.swingSessionId;
    this.term = rawSession.term;
    this.termYear = rawSession.termYear;
    this.trialLocation = this.isStandaloneRemote()
      ? TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
      : rawSession.trialLocation;
    this.proceedingType = this.isStandaloneRemote()
      ? TRIAL_SESSION_PROCEEDING_TYPES.remote
      : rawSession.proceedingType;
    this.trialSessionId =
      rawSession.trialSessionId || applicationContext.getUniqueId();

    if (rawSession.judge?.name) {
      this.judge = {
        name: rawSession.judge.name,
        userId: rawSession.judge.userId,
      };
    }

    if (rawSession.isCalendared && rawSession.startDate) {
      this.setNoticeOfTrialReminderAlert();
    } else {
      this.isStartDateWithinNOTTReminderRange = false;
    }

    if (rawSession.trialClerk && rawSession.trialClerk.name) {
      this.trialClerk = {
        name: rawSession.trialClerk.name,
        userId: rawSession.trialClerk.userId,
      };
    }
  }

  getErrorToMessageMap() {
    return TrialSession.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return {
      ...TrialSession.validationRules.COMMON,
      caseOrder: joi.array().items(
        joi.object().keys({
          calendarNotes: JoiValidationConstants.STRING.optional().allow(
            '',
            null,
          ),
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
    } as object;
  }

  static validationRules_NEW = {
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
      dismissedAlertForNOTT: joi.boolean().optional(),
      entityName:
        JoiValidationConstants.STRING.valid('TrialSession').required(),
      estimatedEndDate: joi
        .when('startDate', {
          is: JoiValidationConstants.ISO_DATE.required(),
          otherwise: joi.optional(),
          then: JoiValidationConstants.ISO_DATE.min(joi.ref('startDate'))
            .optional()
            .allow(null),
        })
        .messages(setDefaultErrorMessage('Enter a valid estimated end date')),
      hasNOTTBeenServed: joi.boolean().required(),
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
      maxCases: joi
        .when('sessionScope', {
          is: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          otherwise: joi.number().greater(0).integer().required(),
          then: joi.optional(),
        })
        .messages(
          setDefaultErrorMessage('Enter a valid number of maximum cases'),
        ),
      meetingId: stringRequiredForRemoteProceedings,
      notes: JoiValidationConstants.STRING.max(400).optional(),
      noticeIssuedDate: JoiValidationConstants.ISO_DATE.optional(),
      password: stringRequiredForRemoteProceedings,
      postalCode: JoiValidationConstants.US_POSTAL_CODE.allow('')
        .optional()
        .messages({
          'string.pattern.base': 'Enter ZIP code',
        }),
      proceedingType: JoiValidationConstants.STRING.valid(
        ...Object.values(TRIAL_SESSION_PROCEEDING_TYPES),
      )
        .required()
        .messages(setDefaultErrorMessage('Enter a valid proceeding type')),
      sessionScope: JoiValidationConstants.STRING.valid(
        ...Object.values(TRIAL_SESSION_SCOPE_TYPES),
      ).required(),
      sessionStatus: JoiValidationConstants.STRING.valid(
        ...Object.values(SESSION_STATUS_TYPES),
      ).required(),
      sessionType: JoiValidationConstants.STRING.valid(
        ...Object.values(SESSION_TYPES),
      )
        .required()
        .messages(setDefaultErrorMessage('Select a session type')),
      startDate: JoiValidationConstants.ISO_DATE.required().messages(
        setDefaultErrorMessage('Enter a valid start date'),
      ),
      startTime: JoiValidationConstants.TWENTYFOUR_HOUR_MINUTES.messages(
        setDefaultErrorMessage('Enter a valid start time'),
      ),
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
      }).messages(setDefaultErrorMessage('You must select a swing session')),
      term: JoiValidationConstants.STRING.valid(...SESSION_TERMS)
        .required()
        .messages(setDefaultErrorMessage('Term session is not valid')),
      termYear: JoiValidationConstants.STRING.max(4)
        .required()
        .messages(setDefaultErrorMessage('Term year is required')),
      trialClerk: joi
        .object({
          name: JoiValidationConstants.STRING.max(100).required(),
          userId: JoiValidationConstants.UUID.required(),
        })
        .optional(),
      trialLocation: joi
        .when('sessionScope', {
          is: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          otherwise: joi
            .alternatives()
            .try(
              JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
              JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
            )
            .required(),
          then: joi.optional(),
        })
        .messages(setDefaultErrorMessage('Select a trial session location')),
      trialSessionId: JoiValidationConstants.UUID.optional(),
    },
  };

  getValidationRules_NEW() {
    return {
      ...TrialSession.validationRules_NEW.COMMON,
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
    } as object;
  }

  setAsSwingSession(swingSessionId) {
    this.swingSessionId = swingSessionId;
    this.swingSession = true;
    return this;
  }

  generateSortKeyPrefix() {
    const { sessionType, trialLocation } = this;
    const caseProcedureSymbol =
      {
        Regular: 'R',
        Small: 'S',
      }[sessionType] || 'H';

    const formattedTrialCity = trialLocation?.replace(/[\s.,]/g, '');

    const skPrefix = [formattedTrialCity, caseProcedureSymbol].join('-');

    return skPrefix;
  }

  setNoticeOfTrialReminderAlert() {
    const formattedStartDate = formatDateString(this.startDate, FORMATS.MMDDYY);
    const trialStartDateString: any = prepareDateFromString(
      formattedStartDate,
      FORMATS.MMDDYY,
    );

    this.isStartDateWithinNOTTReminderRange = isTodayWithinGivenInterval({
      intervalEndDate: trialStartDateString.minus({
        ['days']: 24, // luxon's interval end date is not inclusive
      }),
      intervalStartDate: trialStartDateString.minus({
        ['days']: 34,
      }),
    });

    const thirtyDaysBeforeTrialInclusive: any = trialStartDateString.minus({
      ['days']: 29,
    });

    this.thirtyDaysBeforeTrialFormatted = formatDateString(
      thirtyDaysBeforeTrialInclusive,
      FORMATS.MMDDYY,
    );
  }

  setAsCalendared() {
    this.isCalendared = true;
    this.sessionStatus = SESSION_STATUS_TYPES.open;
    return this;
  }

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

  isCaseAlreadyCalendared(caseEntity) {
    return !!this.caseOrder
      .filter(order => order.docketNumber === caseEntity.docketNumber)
      .filter(order => order.removedFromTrial !== true).length;
  }

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
   */
  canSetAsCalendared() {
    return isEmpty(this.getEmptyFields());
  }

  isRemote() {
    return this.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote;
  }

  isStandaloneRemote() {
    return TrialSession.isStandaloneRemote(this.sessionScope);
  }

  static isStandaloneRemote(sessionScope) {
    return sessionScope === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote;
  }

  getEmptyFields() {
    const missingProperties = TrialSession.PROPERTIES_REQUIRED_FOR_CALENDARING[
      this.proceedingType
    ].filter(property => isEmpty(this[property]));

    return missingProperties;
  }

  setNoticesIssued() {
    this.noticeIssuedDate = createISODateString();
    return this;
  }

  setAsClosed() {
    this.sessionStatus = SESSION_STATUS_TYPES.closed;
    return this;
  }
}

export type RawTrialSession = ExcludeMethods<TrialSession>;
