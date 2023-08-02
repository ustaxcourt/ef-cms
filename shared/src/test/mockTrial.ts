import { MOCK_CASE } from './mockCase';
import { RawNewTrialSession } from '../business/entities/trialSessions/NewTrialSession';
import { RawTrialSession } from '../business/entities/trialSessions/TrialSession';
import {
  SESSION_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../business/entities/EntityConstants';

export const MOCK_TRIAL_REMOTE: RawTrialSession = {
  chambersPhoneNumber: '1111111',
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: true,
  joinPhoneNumber: '0987654321',
  judge: {
    name: 'Chief Judge',
    userId: '822366b7-e47c-413e-811f-d29113d09b06',
  },
  maxCases: 100,
  meetingId: '1234567890',
  password: 'abcdefg',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '48287e71-3754-4017-850d-476a663d1a8e',
};

export const MOCK_TRIAL_REGULAR: RawTrialSession = {
  caseOrder: [{ docketNumber: MOCK_CASE.docketNumber }],
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: false,
  judge: {
    name: 'Judge Yggdrasil',
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  },
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionType: 'Regular',
  startDate: '2001-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
};

export const MOCK_TRIAL_INPERSON: RawTrialSession = {
  address1: '123 Street Lane',
  caseOrder: [
    { docketNumber: MOCK_CASE.docketNumber },
    { docketNumber: '123-45' },
  ],
  chambersPhoneNumber: '3609087782',
  city: 'Scottsburg',
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: false,
  judge: {
    name: 'A Judge',
    userId: '55f4fc65-b33e-4c04-8561-3e56d533f386',
  },
  maxCases: 100,
  postalCode: '47130',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  state: 'IN',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, Alabama',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

export const MOCK_TRIAL_STANDALONE_REMOTE: RawTrialSession = {
  caseOrder: [],
  chambersPhoneNumber: '1111111',
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: true,
  joinPhoneNumber: '0987654321',
  judge: {
    name: 'Chief Judge',
    userId: '822366b7-e47c-413e-811f-d29113d09b06',
  },
  maxCases: 100,
  meetingId: '1234567890',
  password: 'coolestPassword',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionType: 'Regular',
  startDate: '2021-06-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2021',
  trialSessionId: 'f74038af-d51e-4b90-810e-eeba65cda75f',
};

export const MOCK_NEW_TRIAL_REMOTE: RawNewTrialSession = {
  chambersPhoneNumber: '4509876612',
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: false,
  joinPhoneNumber: '8737762291',
  judge: {
    name: 'Chief Judge',
    userId: '822366b7-e47c-413e-811f-d29113d09b06',
  },
  maxCases: 10,
  meetingId: '98727122',
  password: 'zyxwvut',
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  sessionStatus: SESSION_STATUS_TYPES.new,
  sessionType: 'Regular',
  startDate: '2027-11-11T00:00:00.000Z',
  term: 'Winter',
  termYear: '2027',
  trialClerkId: '8e65b405-55d5-4f1c-8773-b3da000b7746',
  trialLocation: 'Seattle, Washington',
  trialSessionId: 'fd274833-139d-483f-9b4b-b2a16a6afaab',
};
