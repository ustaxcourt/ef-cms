import { docketClerkConsolidatesCases } from '../docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from '../docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from '../docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from '../docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, uploadPetition } from '../../helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../petitionsClerkServesElectronicCaseToIrs';

export const createConsolidatedGroup = ({
  caseOverrides = {},
  numberOfMemberCases = 1,
  cerebralTest,
}) => {
  return describe('Create a consolidated group of cases', () => {
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

    it('login as a petitioner and create the lead case', async () => {
      const { docketNumber } = await uploadPetition(
        cerebralTest,
        caseOverrides,
      );

      expect(docketNumber).toBeDefined();

      cerebralTest.docketNumber = cerebralTest.leadDocketNumber = docketNumber;
      cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
        cerebralTest.docketNumber,
      );
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

    for (let index = 1; index <= numberOfMemberCases; index++) {
      it('login as a petitioner and create a case to consolidate with', async () => {
        const { docketNumber } = await uploadPetition(
          cerebralTest,
          caseOverrides,
        );

        expect(docketNumber).toBeDefined();

        cerebralTest.docketNumber = docketNumber;
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
          cerebralTest.docketNumber,
        );
      });

      loginAs(cerebralTest, 'petitionsclerk@example.com');
      petitionsClerkServesElectronicCaseToIrs(cerebralTest);

      loginAs(cerebralTest, 'docketclerk@example.com');
      docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
      docketClerkOpensCaseConsolidateModal(cerebralTest);
      docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
      docketClerkConsolidatesCases(cerebralTest, index + 1);
    }
  });
};
