import { PETITIONS_SECTION } from '../../../shared/src/business/entities/EntityConstants';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const petitionsClerk1User = '4805d1ab-18d0-43ec-bafb-654e83405416';

export const createNewMessageOnCase = (
  cerebralTest,
  {
    docketNumber,
    preserveCreatedMessage = true,
    subject,
    toSection = PETITIONS_SECTION,
    toUserId = petitionsClerk1User,
  }: {
    docketNumber?: string;
    preserveCreatedMessage?: boolean;
    subject?: any;
    toSection?: string;
    toUserId?: string;
  } = {},
) => {
  const messageModalHelper = withAppContextDecorator(
    messageModalHelperComputed,
  );

  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: cerebralTest.getState(),
    });
  };

  return it('user creates new message on a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: toSection,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: toUserId,
    });

    const messageDocument = getHelper().documents[0];
    cerebralTest.testMessageDocumentId = messageDocument.docketEntryId;

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      action: 'add',
      documentId: cerebralTest.testMessageDocumentId,
    });

    expect(cerebralTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    cerebralTest.testMessageSubject =
      subject || `what kind of bear is best? ${Date.now()}`;

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: cerebralTest.testMessageSubject,
    });

    await cerebralTest.runSequence('createMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      message: 'Enter a message',
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await cerebralTest.runSequence('createMessageSequence');

    if (preserveCreatedMessage) {
      await cerebralTest.applicationContext
        .getUseCases()
        .createMessageInteractor.mock.results[0].value.then(message => {
          cerebralTest.lastCreatedMessage = message;
        });
    }

    expect(cerebralTest.getState('modal.form')).toBeDefined();

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
