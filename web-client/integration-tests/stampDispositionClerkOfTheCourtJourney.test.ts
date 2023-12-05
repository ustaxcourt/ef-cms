import { FORMATS } from '@shared/business/utilities/DateHandler';
import { MOTION_DISPOSITIONS } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { userSendsMessage } from './journey/userSendsMessage';

describe('Stamp disposition clerk of the court journey test', () => {
  const cerebralTest = setupTest();

  const clerkOfCourtUserId = '23dd8806-c0c7-4265-81f0-5f264ef78248';
  const messageSubject = 'Motion to Stamp';
  const deniedMotionDocketEntryTitle =
    'Motion DENIED as moot without prejudice';
  const grantedMotionDocketEntryTitle = 'Motion GRANTED';
  const signedJudgeName = 'Maurice B. Foley';

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
      'eventCode',
      'receivedAt',
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

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

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

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const motionDocketEntry = docketEntries.find(
      entry => entry.eventCode === 'M000',
    );

    expect(motionDocketEntry).toBeDefined();

    cerebralTest.docketEntryId = motionDocketEntry.docketEntryId;
  });

  userSendsMessage(
    cerebralTest,
    messageSubject,
    'clerkofcourt',
    clerkOfCourtUserId,
  );

  loginAs(cerebralTest, 'clerkofcourt@example.com');
  it('apply a stamp disposition on the motion from case detail', async () => {
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

  it('verify the first auto-generated draft stamp order', async () => {
    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const draftStampOrder = docketEntries.find(entry => {
      return (
        entry.isDraft === true &&
        entry.eventCode === 'O' &&
        entry.documentTitle === deniedMotionDocketEntryTitle
      );
    });

    expect(draftStampOrder).toMatchObject({
      documentTitle: deniedMotionDocketEntryTitle,
      freeText: deniedMotionDocketEntryTitle,
      isDraft: true,
      signedJudgeName,
      stampData: {
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: 'Denied',
        entityName: 'Stamp',
      },
    });
  });

  it('apply a stamp disposition on the motion from message', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const messages = cerebralTest.getState('messages');
    const foundMessage = messages.find(
      message => message.subject === messageSubject,
    );

    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
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
      value: MOTION_DISPOSITIONS.GRANTED,
    });

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('verify the second auto-generated draft stamp order', () => {
    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const draftStampOrder = docketEntries.find(
      entry =>
        entry.isDraft === true &&
        entry.eventCode === 'O' &&
        entry.documentTitle === grantedMotionDocketEntryTitle,
    );

    expect(draftStampOrder).toMatchObject({
      documentTitle: grantedMotionDocketEntryTitle,
      freeText: grantedMotionDocketEntryTitle,
      isDraft: true,
      signedJudgeName,
      stampData: {
        disposition: 'Granted',
        entityName: 'Stamp',
      },
    });
  });
});
