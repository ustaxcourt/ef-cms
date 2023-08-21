import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkChecksDocketEntryEditLink } from './journey/docketClerkChecksDocketEntryEditLink';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkNavigatesToEditDocketEntryMeta } from './journey/docketClerkNavigatesToEditDocketEntryMeta';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkStrikesDocketEntry } from './journey/docketClerkStrikesDocketEntry';
import { docketClerkUpdatesCaseStatusTo } from './journey/docketClerkUpdatesCaseStatusTo';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { viewJudgeActivityReportResults } from './journey/viewJudgeActivityReportResults';
import { withAppContextDecorator } from '../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

let progressDescriptionTableTotalBefore = 0;

describe('Judge activity report journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should disable the submit button on initial page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const { isFormPristine, reportHeader } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(isFormPristine).toBe(true);
    expect(reportHeader).toContain('Colvin');
  });

  it('should display an error message when invalid dates are entered into the form', async () => {
    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      startDate: '--_--',
    });

    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      endDate: 'yabbadabaadooooo',
    });

    await cerebralTest.runSequence('submitJudgeActivityReportSequence', {
      selectedPage: 0,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      endDate: 'Enter a valid end date.',
      startDate: 'Enter a valid start date.',
    });
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(cerebralTest, CASE_STATUS_TYPES.cav, 'Colvin');

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest, {});
  it('should increase progressDescriptionTableTotal by 2 when there is one "CAV" case and one "Submitted" case added', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore + 2,
    );
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should not increase progressDescriptionTableTotal when a non-submitted or non-CAV case is added', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order and Decision',
    eventCode: 'OAD',
    expectedDocumentType: 'Order and Decision',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0, 'Colvin');
  docketClerkServesDocument(cerebralTest, 0);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should not increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });

  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order and Decision',
    eventCode: 'OAD',
    expectedDocumentType: 'Order and Decision',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record and is not served', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore + 1,
    );
  });

  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order and Decision',
    eventCode: 'OAD',
    expectedDocumentType: 'Order and Decision',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record and is not served', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore + 1,
    );
  });

  // //// new test ==================================================
  it('should set the progressDescriptionTableBeforeCount', () => {
    progressDescriptionTableTotalBefore =
      cerebralTest.progressDescriptionTableTotal;
  });

  // loginAs(cerebralTest, 'petitionsclerk@example.com');
  // petitionsClerkCreatesNewCase(cerebralTest);

  // // describe('Petitions clerk serves case to IRS', () => {
  // //   loginAs(cerebralTest, 'petitionsclerk@example.com');
  // //   petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  // // });

  // // describe('Petitioner files a document for the case', () => {
  // //   loginAs(cerebralTest, 'petitioner@example.com');
  // //   petitionerFilesADocumentForCase(cerebralTest, fakeFile);
  // // });

  //TODO: rename
  // describe('Docketclerk QCs and Strikes a docket entry', () => {
  //   loginAs(cerebralTest, 'docketclerk@example.com');
  //   docketClerkUpdatesCaseStatusTo(
  //     cerebralTest,
  //     CASE_STATUS_TYPES.submitted,
  //     'Colvin',
  //   );
  //   docketClerkCreatesAnOrder(cerebralTest, {
  //     documentTitle: 'Order',
  //     eventCode: 'O',
  //     expectedDocumentType: 'Order',
  //   });
  //   docketClerkViewsDraftOrder(cerebralTest);
  //   docketClerkSignsOrder(cerebralTest);
  //   docketClerkAddsDocketEntryFromOrder(cerebralTest, 0, 'Colvin');
  //   docketClerkServesDocument(cerebralTest, 0);
  //   // docketClerkChecksDocketEntryEditLink(cerebralTest);
  //   // QCs docket entry
  //   docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });
  //   docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 3);
  //   docketClerkStrikesDocketEntry(cerebralTest, 3);
  // });

  describe('Petitioner creates a case', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('petitioner creates an electronic case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      cerebralTest.docketNumber = caseDetail.docketNumber;
      console.log('cerebralTest.docketNumber', cerebralTest.docketNumber);
    });
  });

  describe('Petitions clerk serves case to IRS', () => {
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusTo(
    cerebralTest,
    CASE_STATUS_TYPES.submitted,
    'Colvin',
  );

  describe('Petitioner files a document for the case', () => {
    loginAs(cerebralTest, 'petitioner@example.com');
    petitionerFilesADocumentForCase(cerebralTest, fakeFile);
  });

  describe('Docketclerk QCs and Strikes a docket entry', () => {
    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkChecksDocketEntryEditLink(cerebralTest);
    docketClerkQCsDocketEntry(cerebralTest);
    docketClerkChecksDocketEntryEditLink(cerebralTest, { value: true });
    docketClerkNavigatesToEditDocketEntryMeta(cerebralTest, 3);
    docketClerkStrikesDocketEntry(cerebralTest, 3);
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest);
  it('should not increase progressDescriptionTableTotal when a case has a Decision type docket entry on the docket record and is stricken', () => {
    const progressDescriptionTableTotalAfter =
      cerebralTest.progressDescriptionTableTotal;

    expect(progressDescriptionTableTotalAfter).toEqual(
      progressDescriptionTableTotalBefore,
    );
  });
});
