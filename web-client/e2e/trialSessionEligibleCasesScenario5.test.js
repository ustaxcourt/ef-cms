import { CerebralTest } from 'cerebral/test';
import { isFunction, mapValues } from 'lodash';
import FormData from 'form-data';

import {
  CASE_CAPTION_POSTFIX,
  STATUS_TYPES,
} from '../../shared/src/business/entities/Case';
import {
  CATEGORIES,
  CATEGORY_MAP,
  INTERNAL_CATEGORY_MAP,
} from '../../shared/src/business/entities/Document';
import { Document } from '../../shared/src/business/entities/Document';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';

import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';

import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSetsCaseReadyForTrial from './journey/petitionsClerkSetsCaseReadyForTrial';
import petitionsClerkUpdatesFiledBy from './journey/petitionsClerkUpdatesFiledBy';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
import userSignsOut from './journey/taxpayerSignsOut';

const {
  PARTY_TYPES,
  COUNTRY_TYPES,
} = require('../../shared/src/business/entities/contacts/PetitionContact');

let test;
global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  externalRoute: () => {},
  route: async url => {
    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Trial Session Eligible Cases - Scenario 5 - Cases are scheduled sequentially based upon the date and time the petition was filed (FIFO)', () => {
  beforeEach(() => {
    jest.setTimeout(300000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX,
      CATEGORIES,
      CATEGORY_MAP,
      COUNTRY_TYPES,
      DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
      INTERNAL_CATEGORY_MAP,
      PARTY_TYPES,
      STATUS_TYPES,
      TRIAL_CITIES,
    });
  });

  const trialLocation = `Vacaville, California, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Regular',
    trialLocation,
  };
  const createdCases = [];

  describe(`Create trial session with Regular session type for '${trialLocation}' with max case count = 2`, () => {
    docketClerkLogIn(test);
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsAnUpcomingTrialSession(test);
    userSignsOut(test);
  });

  describe('Create cases', () => {
    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Regular',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '01',
      };
      taxpayerLogin(test);
      taxpayerNavigatesToCreateCase(test);
      taxpayerChoosesProcedureType(test, caseOverrides);
      taxpayerChoosesCaseType(test);
      taxpayerCreatesNewCase(test, fakeFile);
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 2/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Regular',
        receivedAtYear: '2019',
        receivedAtMonth: '02',
        receivedAtDay: '01',
      };
      taxpayerLogin(test);
      taxpayerNavigatesToCreateCase(test);
      taxpayerChoosesProcedureType(test, caseOverrides);
      taxpayerChoosesCaseType(test);
      taxpayerCreatesNewCase(test, fakeFile);
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Regular',
        receivedAtYear: '2019',
        receivedAtMonth: '03',
        receivedAtDay: '01',
      };
      taxpayerLogin(test);
      taxpayerNavigatesToCreateCase(test);
      taxpayerChoosesProcedureType(test, caseOverrides);
      taxpayerChoosesCaseType(test);
      taxpayerCreatesNewCase(test, fakeFile);
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });
  });

  describe(`Result: Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(3);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[1],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[2],
      );
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
      expect(test.getState('trialSession.isCalendared')).toEqual(false);
    });

    userSignsOut(test);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);
    petitionsClerkSetsATrialSessionsSchedule(test);
    userSignsOut(test);
  });

  describe(`Result: Case #1 and #2 are assigned to '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #1 and #2 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(2);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCases[1],
      );
    });

    userSignsOut(test);
  });
});
