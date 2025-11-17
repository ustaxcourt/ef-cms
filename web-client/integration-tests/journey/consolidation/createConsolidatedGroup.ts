import { docketClerkConsolidatesCases } from '../docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from '../docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from '../docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusTo } from '../docketClerkUpdatesCaseStatusTo';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from '../docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, uploadPetition } from '../../helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../petitionsClerkServesElectronicCaseToIrs';

export const createConsolidatedGroup = (
  cerebralTest,
  caseOverrides: {
    caseStatus?: string;
    caseType?: string;
    contactPrimary?: object;
    contactSecondary?: object;
    partyType?: string;
    preferredTrialCity?: string;
    procedureType?: string;
    corporateDisclosureFileId?: string;
  } = {},
  numberOfMemberCases: number = 1,
) => {
  return describe('Create a consolidated group of cases', () => {
    it('login as a petitioner and create the lead case', async () => {
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];
      const { docketNumber } = await uploadPetition(
        cerebralTest,
        caseOverrides,
      );

      expect(docketNumber).toBeDefined();

      cerebralTest.leadDocketNumber = docketNumber;
      cerebralTest.docketNumber = docketNumber;
      if (!cerebralTest.leadDocketNumber) {
        throw new Error('Test setup failed: leadDocketNumber is not set');
      }
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
        cerebralTest.docketNumber,
      );
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');

    if (caseOverrides.caseStatus) {
      docketClerkUpdatesCaseStatusTo(
        cerebralTest,
        caseOverrides.caseStatus,
        'Colvin',
        'dabbad00-18d0-43ec-bafb-654e83405416',
      );
    } else {
      docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
    }
    for (let i = 1; i <= numberOfMemberCases; i++) {
      it('login as a petitioner and create a case to consolidate with', async () => {
        const { docketNumber } = await uploadPetition(
          cerebralTest,
          caseOverrides,
          'petitioner1@example.com',
        );

        expect(docketNumber).toBeDefined();

        cerebralTest.docketNumber = docketNumber;
        if (!cerebralTest.leadDocketNumber) {
          throw new Error('Test setup failed: leadDocketNumber is not set before member case creation');
        }
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
          cerebralTest.docketNumber,
        );
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkServesElectronicCaseToIrs(cerebralTest);

      loginAs(cerebralTest, 'docketclerk@example.com');
      if (caseOverrides.caseStatus) {
        docketClerkUpdatesCaseStatusTo(
          cerebralTest,
          caseOverrides.caseStatus,
          'Colvin',
          'dabbad00-18d0-43ec-bafb-654e83405416',
        );
      } else {
        docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
      }
      docketClerkOpensCaseConsolidateModal(cerebralTest);
      docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
      docketClerkConsolidatesCases(cerebralTest, i + 1);
    }
  });
};
