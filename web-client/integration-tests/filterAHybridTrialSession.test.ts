import {
  CASE_TYPES_MAP,
  PROCEDURE_TYPES_MAP,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases } from './journey/petitionsClerkViewsAHybridTrialSessionsFilteredEligibleCases';

describe('Filter A Hybrid Trial Session', () => {
  const cerebralTest = setupTest();

  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };
  const caseId = 0;
  const caseCount = 4;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const { docketNumber } = await uploadPetition(testSession, caseOverrides);

      expect(docketNumber).toBeDefined();

      testSession.docketNumber = docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  makeCaseReadyForTrial(cerebralTest, caseId + 1, overrides);
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
  });
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    procedureType: PROCEDURE_TYPES_MAP.small,
  });
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    procedureType: PROCEDURE_TYPES_MAP.small,
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
  );

  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
    'Regular',
  );

  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
    'Small',
  );
});
