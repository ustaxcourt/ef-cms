import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { privatePractitionerViewsOpenConsolidatedCases } from './journey/privatePractitionerViewsOpenConsolidatedCases';

describe('private practitioner views consolidated cases with statistics (cerebralTest for bug 8473)', () => {
  const cerebralTest = setupTest();

  const createdDocketNumbers: string[] = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  for (let i = 0; i < 2; i++) {
    loginAs(cerebralTest, 'privatepractitioner@example.com');
    it(`Create test case #${i}`, async () => {
      const caseDetail = await uploadPetition(
        cerebralTest,
        {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        'privatepractitioner@example.com',
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
  docketClerkConsolidatesCases(cerebralTest, 2);

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  privatePractitionerViewsOpenConsolidatedCases(cerebralTest);
});
