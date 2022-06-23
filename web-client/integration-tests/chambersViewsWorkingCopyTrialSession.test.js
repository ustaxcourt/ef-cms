import { PARTIES_CODES } from '../../shared/src/business/entities/EntityConstants';
import { chambersViewsTrialSessionWorkingCopy } from './journey/chambersViewsTrialSessionWorkingCopy';
import { docketClerkAddsPretrialMemorandumToCase } from './journey/docketClerkAddsPretrialMemorandumToCase';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { formattedTrialSessionDetails } from '../src/presenter/computeds/formattedTrialSessionDetails';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { manuallyAddCaseToTrial } from './utils/manuallyAddCaseToTrial';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const cerebralTest = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'colvinsChambers@example.com');
  chambersViewsTrialSessionWorkingCopy(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesARemoteTrialSession(cerebralTest);

  for (let i = 1; i <= 4; i++) {
    loginAs(cerebralTest, 'petitioner@example.com');
    it(`Creates case ${i} and adds to trial session`, async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest[`docketNumber${i}`] = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    manuallyAddCaseToTrial(cerebralTest, { index: i });
  }

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 1,
    filedByPetitioner: true,
    filedByPractitioner: false,
  });

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 2,
    filedByPetitioner: false,
    filedByPractitioner: true,
  });

  docketClerkAddsPretrialMemorandumToCase(cerebralTest, {
    caseNumber: 3,
    filedByPetitioner: true,
    filedByPractitioner: true,
  });

  // it('docket clerk adds pretrial memorandum to case 1 filed by petitioner', async () => {
  //   await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //     docketNumber: cerebralTest.docketNumber1,
  //   });

  //   await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
  //     docketNumber: cerebralTest.docketNumber1,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedMonth',
  //     value: 4,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedDay',
  //     value: 30,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedYear',
  //     value: 2001,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFile',
  //     value: fakeFile,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFileSize',
  //     value: 100,
  //   });

  //   const contactPrimary = contactPrimaryFromState(cerebralTest);

  //   await cerebralTest.runSequence(
  //     'updateFileDocumentWizardFormValueSequence',
  //     {
  //       key: `filersMap.${contactPrimary.contactId}`,
  //       value: true,
  //     },
  //   );

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'eventCode',
  //     value: 'PMT',
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'objections',
  //     value: OBJECTIONS_OPTIONS_MAP.NO,
  //   });

  //   await cerebralTest.runSequence('submitPaperFilingSequence');

  //   expect(cerebralTest.getState('validationErrors')).toEqual({});

  //   expect(cerebralTest.getState('alertSuccess').message).toEqual(
  //     'Your entry has been added to docket record.',
  //   );

  //   expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  // });

  // it('docket clerk adds pretrial memorandum to case 2 filed by respondent', async () => {
  //   await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //     docketNumber: cerebralTest.docketNumber2,
  //   });

  //   await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
  //     docketNumber: cerebralTest.docketNumber2,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedMonth',
  //     value: 4,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedDay',
  //     value: 30,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedYear',
  //     value: 2001,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFile',
  //     value: fakeFile,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFileSize',
  //     value: 100,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'partyIrsPractitioner',
  //     value: true,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'eventCode',
  //     value: 'PMT',
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'objections',
  //     value: OBJECTIONS_OPTIONS_MAP.NO,
  //   });

  //   await cerebralTest.runSequence('submitPaperFilingSequence');

  //   expect(cerebralTest.getState('validationErrors')).toEqual({});

  //   expect(cerebralTest.getState('alertSuccess').message).toEqual(
  //     'Your entry has been added to docket record.',
  //   );

  //   expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  // });

  // it('docket clerk adds pretrial memorandum to case 3 filed by petitioner and respondent', async () => {
  //   await cerebralTest.runSequence('gotoCaseDetailSequence', {
  //     docketNumber: cerebralTest.docketNumber3,
  //   });

  //   await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
  //     docketNumber: cerebralTest.docketNumber3,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedMonth',
  //     value: 4,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedDay',
  //     value: 30,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'dateReceivedYear',
  //     value: 2001,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFile',
  //     value: fakeFile,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'primaryDocumentFileSize',
  //     value: 100,
  //   });

  //   const contactPrimary = contactPrimaryFromState(cerebralTest);

  //   await cerebralTest.runSequence(
  //     'updateFileDocumentWizardFormValueSequence',
  //     {
  //       key: `filersMap.${contactPrimary.contactId}`,
  //       value: true,
  //     },
  //   );

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'partyIrsPractitioner',
  //     value: true,
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'eventCode',
  //     value: 'PMT',
  //   });

  //   await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
  //     key: 'objections',
  //     value: OBJECTIONS_OPTIONS_MAP.NO,
  //   });

  //   await cerebralTest.runSequence('submitPaperFilingSequence');

  //   expect(cerebralTest.getState('validationErrors')).toEqual({});

  //   expect(cerebralTest.getState('alertSuccess').message).toEqual(
  //     'Your entry has been added to docket record.',
  //   );

  //   expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  //   expect(cerebralTest.getState('form')).toEqual({});

  //   cerebralTest.docketEntryId = cerebralTest
  //     .getState('caseDetail.docketEntries')
  //     .find(doc => doc.eventCode === 'PMT').docketEntryId;
  // });

  loginAs(cerebralTest, 'cohensChambers@example.com');
  it('chambers user verifies PTM column and value for case 1', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseWithPtmFiledByPetitioner = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber1,
    );
    const caseWithPtmFiledByRespondent = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber2,
    );
    const caseWithPtmFiledByBoth = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber3,
    );
    const caseWithoutPtm = trialSessionFormatted.allCases.find(
      c => c.docketNumber === cerebralTest.docketNumber4,
    );

    expect(caseWithPtmFiledByPetitioner.filingPartiesCode).toBe(
      PARTIES_CODES.PETITIONER,
    );
    expect(caseWithPtmFiledByRespondent.filingPartiesCode).toBe(
      PARTIES_CODES.RESPONDENT,
    );
    expect(caseWithPtmFiledByBoth.filingPartiesCode).toBe(PARTIES_CODES.BOTH);
    expect(caseWithoutPtm.filingPartiesCode).toBeUndefined();
  });
});
