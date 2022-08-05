import { MOTION_DISPOSITIONS } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
const cerebralTest = setupTest();

describe('Stamp disposition journey test', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('create a paper-filed Motion docket entry', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'filers',
    ];

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M000',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'For testing Stamp Disposition',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Nonstandard B',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const motionDocketEntry = docketEntries.find(
      entry => entry.eventCode === 'M000',
    );

    expect(motionDocketEntry).toBeDefined();

    cerebralTest.docketEntryId = motionDocketEntry.docketEntryId;
  });

  loginAs(cerebralTest, 'judgeCohen@example.com');
  it('apply a stamp disposition on the motion', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('goToApplyStampSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('ApplyStamp');

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      disposition: 'Enter a disposition',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'disposition',
      value: MOTION_DISPOSITIONS.DENIED,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'deniedAsMoot',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'deniedWithoutPrejudice',
      value: true,
    });

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('verify the auto-generated draft stamp order', async () => {
    expect(cerebralTest.getState('currentPage')).toBe('CaseDetailInternal');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const draftStampOrder = docketEntries.find(
      entry => entry.isDraft === true && entry.eventCode === 'O',
    );

    expect(draftStampOrder).toMatchObject({
      documentTitle: 'Motion DENIED as moot without prejudice',
      freeText: 'Motion DENIED as moot without prejudice',
      isDraft: true,
      signedJudgeName: 'Mary Ann Cohen',
      stampData: {
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: 'Denied',
        entityName: 'Stamp',
      },
    });
  });
});
