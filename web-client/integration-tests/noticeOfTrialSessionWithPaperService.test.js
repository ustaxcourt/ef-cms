import {
  COUNTRY_TYPES,
  PARTY_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring } from './journey/docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCompletesAndSetsTrialSession } from './journey/petitionsClerkCompletesAndSetsTrialSession';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsDocketRecordAfterSettingTrial } from './journey/petitionsClerkViewsDocketRecordAfterSettingTrial';

const cerebralTest = setupTest();

describe('Generate Notices of Trial Session with Paper Service', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    contactSecondary: {
      address1: '123 Paper St.',
      city: 'Paper City',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Richard Papers',
      phone: '1231231234',
      postalCode: '12345',
      state: 'IA',
    },
    hasPaper: true,
    partyType: PARTY_TYPES.petitionerSpouse,
    preferredTrialCity: trialLocation,
    procedureType: 'Small', // should generate a Standing Pretrial Order for Small Cases
    trialLocation,
  };

  cerebralTest.casesReadyForTrial = [];

  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring(
    cerebralTest,
    overrides,
  );
  docketClerkViewsTrialSessionList(cerebralTest);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(cerebralTest, id, overrides);
  }

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(cerebralTest, () => {
    return [createdDocketNumbers[0], createdDocketNumbers[1]];
  });
  petitionsClerkCompletesAndSetsTrialSession(cerebralTest, overrides);
  petitionsClerkViewsDocketRecordAfterSettingTrial(cerebralTest, {
    documentTitle:
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
        .documentTitle,
    eventCode:
      SYSTEM_GENERATED_DOCUMENT_TYPES.standingPretrialOrderForSmallCase
        .eventCode,
  });
});
