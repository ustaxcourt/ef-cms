import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { Document } from '../../shared/src/business/entities/Document';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { uploadPetition } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
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
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';
import userSignsOut from './journey/taxpayerSignsOut';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');

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

test = CerebralTest(presenter);

describe('Trial Session Eligible Cases Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
      INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      STATUS_TYPES: Case.STATUS_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdCases = [];
  const createdDocketNumbers = [];

  describe(`Create trial session with Small session type for '${trialLocation}' with max case count = 1`, () => {
    docketClerkLogIn(test);
    docketClerkCreatesATrialSession(test, overrides);
    docketClerkViewsTrialSessionList(test, overrides);
    docketClerkViewsAnUpcomingTrialSession(test);
    userSignsOut(test);
  });

  describe('Create cases', () => {
    describe(`Case #1 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '01',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #1', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #2 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '02',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #2', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #3 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Regular',
        receivedAtYear: '2019',
        receivedAtMonth: '01',
        receivedAtDay: '01',
        caseType: 'Deficiency',
      };
      taxpayerLogin(test);
      it('Create case #3', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #4 'L' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 5/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '02',
        receivedAtDay: '01',
        caseType: 'CDP (Lien/Levy)',
      };
      taxpayerLogin(test);
      it('Create case #4', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });

    describe(`Case #5 'P' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        procedureType: 'Small',
        receivedAtYear: '2019',
        receivedAtMonth: '03',
        receivedAtDay: '01',
        caseType: 'Passport',
      };
      taxpayerLogin(test);
      it('Create case #5', async () => {
        await uploadPetition(test, caseOverrides);
      });
      taxpayerViewsDashboard(test);
      captureCreatedCase(test, createdCases, createdDocketNumbers);
      userSignsOut(test);
      petitionsClerkLogIn(test);
      petitionsClerkUpdatesFiledBy(test, caseOverrides);
      petitionsClerkSendsCaseToIRSHoldingQueue(test);
      petitionsClerkRunsBatchProcess(test);
      petitionsClerkSetsCaseReadyForTrial(test);
      userSignsOut(test);
    });
  });

  describe(`Result: Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, () => {
    petitionsClerkLogIn(test);

    it(`Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.eligibleCases').length).toEqual(4);
      expect(test.getState('trialSession.eligibleCases.0.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.eligibleCases.1.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.eligibleCases.2.caseId')).toEqual(
        createdCases[0],
      );
      expect(test.getState('trialSession.eligibleCases.3.caseId')).toEqual(
        createdCases[1],
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

  describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
    petitionsClerkLogIn(test);

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      expect(test.getState('trialSession.calendaredCases').length).toEqual(3);
      expect(test.getState('trialSession.isCalendared')).toEqual(true);
      expect(test.getState('trialSession.calendaredCases.0.caseId')).toEqual(
        createdCases[3],
      );
      expect(test.getState('trialSession.calendaredCases.1.caseId')).toEqual(
        createdCases[4],
      );
      expect(test.getState('trialSession.calendaredCases.2.caseId')).toEqual(
        createdCases[0],
      );
    });

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
      //Case #1 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');
      expect(test.getState('caseDetail.trialLocation')).toEqual(trialLocation);
      expect(test.getState('caseDetail.trialDate')).toEqual(
        '2025-12-12T05:00:00.000Z',
      );
      expect(test.getState('caseDetail.trialJudge')).toEqual('Judge Cohen');

      //Case #2 - not assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');
      expect(test.getState('caseDetail.trialLocation')).toBeUndefined();
      expect(test.getState('caseDetail.trialDate')).toBeUndefined();
      expect(test.getState('caseDetail.trialJudge')).toBeUndefined();

      //Case #3 - not assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[2],
      });
      expect(test.getState('caseDetail.status')).not.toEqual('Calendared');

      //Case #4 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[3],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');

      //Case #5 - assigned
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[4],
      });
      expect(test.getState('caseDetail.status')).toEqual('Calendared');
    });

    userSignsOut(test);
  });
});
