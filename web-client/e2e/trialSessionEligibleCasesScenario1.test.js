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

import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsCaseReadyForTrial from './journey/petitionsClerkSetsCaseReadyForTrial';
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

describe('Trial Session Eligible Cases - Scenario 1', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
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

  const trialLocation = `Baton Rouge, Louisiana, ${Date.now()}`;
  const overrides = {
    maxCases: 1,
    preferredTrialCity: trialLocation,
    procedureType: 'Small',
    sessionType: 'Hybrid',
    trialLocation,
  };

  describe(`Create trial session for '${trialLocation}'`, () => {
    docketClerkLogIn(test);
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsAnUpcomingTrialSession(test);
    userSignsOut(test);
  });

  describe(`#1 Case with status “General Docket - Not at Issue” for '${trialLocation}'`, () => {
    taxpayerLogin(test);
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test, overrides);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerViewsDashboard(test);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    // Case is not set ready for trial
    // petitionsClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  });

  describe(`#2 Case with Status “General Docket - At Issue” for '${trialLocation}'`, () => {
    taxpayerLogin(test);
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test, overrides);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerViewsDashboard(test);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    petitionsClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  });

  describe('#3 Case with status “General Docket - At Issue” for [another trial location]', () => {
    taxpayerLogin(test);
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerViewsDashboard(test);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    petitionsClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  });

  describe(`Check eligible cases for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Only one case (#2) should show up as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(1);
      expect(test.getState('trialSession.status')).toEqual('Upcoming');
    });

    userSignsOut(test);
  });
});
