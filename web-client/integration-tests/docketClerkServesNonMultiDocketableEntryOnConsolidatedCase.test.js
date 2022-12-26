import {
  OBJECTIONS_OPTIONS_MAP,
  SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
} from '../../shared/src/business/entities/EntityConstants';
import { confirmInitiatePaperFilingServiceModalHelper } from '../src/presenter/computeds/confirmInitiatePaperFilingServiceModalHelper';
import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { fakeFile } from '../integration-tests-public/helpers';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk serves non multi-docketable entry on consolidated case', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  const documentFormValues = {
    dateReceivedDay: 1,
    dateReceivedMonth: 1,
    dateReceivedYear: 2018,
    eventCode: SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES[0],
    objections: OBJECTIONS_OPTIONS_MAP.NO,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 100,
  };

  docketClerkAddsPaperFiledDocketEntryAndSavesForLater({
    cerebralTest,
    documentFormValues,
    expectedDocumentType: 'Agreed Computation for Entry of Decision',
  });

  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  it('docket clerk serves decision document from document viewer', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: cerebralTest.docketEntryId,
        redirectUrl: `/case-detail/${cerebralTest.leadDocketNumber}/document-view?docketEntryId=${cerebralTest.docketEntryId}`,
      },
    );

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiatePaperFilingServiceModal',
    );
  });

  it('docket clerk verifies consolidated case checkboxes do NOT display for case decision service', () => {
    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiatePaperFilingServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(modalHelper.showConsolidatedCasesForService).toBe(false);
  });
});
