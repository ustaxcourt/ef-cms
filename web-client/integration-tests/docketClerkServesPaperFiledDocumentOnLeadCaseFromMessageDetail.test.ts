import {
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
  OBJECTIONS_OPTIONS_MAP,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { confirmInitiateServiceModalHelper } from '../src/presenter/computeds/confirmInitiateServiceModalHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForCondition,
  waitForLoadingComponentToHide,
} from './helpers';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk Serves Paper Filed Document On Lead Case From Message Detail', () => {
  const cerebralTest = setupTest();

  const motionForLeaveToFileForm = {
    eventCode: 'M115',
    objections: OBJECTIONS_OPTIONS_MAP.NO,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 100,
    'secondaryDocument.addToCoversheet': true,
    'secondaryDocument.additionalInfo': 'Test Secondary Additional Info',
    'secondaryDocument.eventCode': 'APPW',
    secondaryDocumentFile: fakeFile,
    secondaryDocumentFileSize: 100,
  };

  const motionForLeaveToFileCaseMessageForm = {
    message: 'You should not see any checkboxes on the service modal!',
    subject: 'Here is a paper filing on a lead case to be served!',
    toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416', // docketClerk1
  };

  beforeAll(() => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('creates the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('creates the member case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk1@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  it('docketClerk adds paper filed docket entry on lead case and saves for later', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    for (const [key, value] of Object.entries(motionForLeaveToFileForm)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: `filersMap.${contactId}`,
      value: true,
    });

    await cerebralTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    cerebralTest.docketEntryId = docketEntries.find(
      doc => doc.eventCode === motionForLeaveToFileForm.eventCode,
    ).docketEntryId;
  });

  it('docketClerk creates new message on the lead case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      action: 'add',
      documentId: cerebralTest.docketEntryId,
    });

    cerebralTest.testMessageSubject =
      motionForLeaveToFileCaseMessageForm.subject;

    for (const [key, value] of Object.entries(
      motionForLeaveToFileCaseMessageForm,
    )) {
      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('createMessageSequence');

    await cerebralTest.applicationContext
      .getUseCases()
      .createMessageInteractor.mock.results[0].value.then(message => {
        cerebralTest.lastCreatedMessage = message;
      });

    await refreshElasticsearchIndex();
  });

  it('docketClerk views their message inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');
    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    cerebralTest.testMessageDocumentId = foundMessage.attachments[0].documentId;
    cerebralTest.parentMessageId = foundMessage.parentMessageId;
  });

  it('docketClerk views the message detail of the message sent on the lead case', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
      parentMessageId: cerebralTest.parentMessageId,
    });

    expect(cerebralTest.getState('messageDetail')).toMatchObject([
      {
        parentMessageId: cerebralTest.parentMessageId,
      },
    ]);
  });

  it('docketClerk serves the paper filing from from message detail', async () => {
    await cerebralTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: cerebralTest.docketEntryId,
        redirectUrl: `/messages/${cerebralTest.leadDocketNumber}/message-detail/${cerebralTest.parentMessageId}`,
      },
    );

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(modalHelper.showConsolidatedCasesForService).toBe(false);
    expect(cerebralTest.getState('modal.showModal')).toBe(
      'ConfirmInitiatePaperFilingServiceModal',
    );

    await cerebralTest.runSequence('servePaperFiledDocumentSequence');

    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: 'Your entry has been added to the docket record.',
      overwritable: false,
    });
    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');
  });
});
