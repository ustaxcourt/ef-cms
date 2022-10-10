import { docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater';
import { docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Docket clerk adds paper filing on lead case', () => {
  const cerebralTest = setupTest();

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.docketNumber,
    );
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create a case to consolidate with', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
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
  docketClerkConsolidatesCases(cerebralTest, 2);

  docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes(
    cerebralTest,
    'A',
  );

  it('verify multi-docketed document has been filed on every case in the consolidated group', async () => {
    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const multiDocketedDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(
          doc => doc.docketEntryId === cerebralTest.multiDocketedDocketEntryId,
        );

      expect(multiDocketedDocketEntry).toBeDefined();
    }
  });

  docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater(
    cerebralTest,
    'RPT',
  );

  it('verify multi-docketed document has been filed on every case in the consolidated group', async () => {
    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const multiDocketedDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(
          doc => doc.docketEntryId === cerebralTest.multiDocketedDocketEntryId,
        );

      expect(multiDocketedDocketEntry).toBeDefined();
    }
  });
});
