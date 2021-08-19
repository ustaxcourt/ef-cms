import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { privatePractitionerViewsOpenConsolidatedCases } from './journey/privatePractitionerViewsOpenConsolidatedCases';

const cerebralTest = setupTest();

describe('private practitioner views consolidated cases with statistics (cerebralTest for bug 8473)', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const createdDocketNumbers = [];

  for (let i = 0; i < 2; i++) {
    loginAs(cerebralTest, 'privatePractitioner@example.com');
    it(`Create test case #${i}`, async () => {
      const caseDetail = await uploadPetition(
        cerebralTest,
        {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        'privatePractitioner@example.com',
      );
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      createdDocketNumbers.push(cerebralTest.docketNumber);
      cerebralTest.leadDocketNumber = createdDocketNumbers[0];
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkEditsPetitionInQCIRSNotice(cerebralTest);
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
  }

  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  privatePractitionerViewsOpenConsolidatedCases(cerebralTest);
});
