import {
  DOCKET_SECTION,
  DOCUMENT_SERVED_MESSAGES,
} from '../../shared/src/business/entities/EntityConstants';
import { confirmInitiateServiceModalHelper } from '../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  waitForLoadingComponentToHide,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk Serves Paper Filed Document On Lead Case From Message Detail', () => {
  const cerebralTest = setupTest();

  const miscellaneousForm = {
    documentTitle: 'Court issued document filed on lead case',
    documentType: 'Miscellaneous',
    eventCode: 'MISC',
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 100,
  };

  const miscellaneousCaseMessageForm = {
    message: 'You should not see any checkboxes on the service modal!',
    subject: 'Here is a court issued filing on a lead case to be served!',
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

  it('docketClerk adds court issued filing draft on the lead case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: miscellaneousForm.documentTitle,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const { draftDocuments } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    cerebralTest.draftDocument = draftDocuments.find(
      doc => doc.documentTitle === miscellaneousForm.documentTitle,
    );
  });

  it('docketClerk adds a docket entry for the court issued draft on the lead case', async () => {
    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.draftDocument.docketEntryId,
      docketNumber: cerebralTest.leadDocketNumber,
    });

    for (const [key, value] of Object.entries(miscellaneousForm)) {
      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('saveCourtIssuedDocketEntrySequence');
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
      documentId: cerebralTest.draftDocument.docketEntryId,
    });

    cerebralTest.testMessageSubject = miscellaneousCaseMessageForm.subject;
    for (const [key, value] of Object.entries(miscellaneousCaseMessageForm)) {
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

  it('docketClerk serves the court issued filing from from message detail', async () => {
    await cerebralTest.runSequence(
      'openConfirmServeCourtIssuedDocumentSequence',
      {
        docketEntryId: cerebralTest.draftDocument.docketEntryId,
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
      'ConfirmInitiateCourtIssuedFilingServiceModal',
    );

    await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: DOCUMENT_SERVED_MESSAGES.GENERIC,
      overwritable: false,
    });
    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');
  });
});
