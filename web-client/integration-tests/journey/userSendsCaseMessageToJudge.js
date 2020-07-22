import { caseMessageModalHelper as caseMessageModalHelperComputed } from '../../src/presenter/computeds/caseMessageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseMessageModalHelper = withAppContextDecorator(
  caseMessageModalHelperComputed,
);

export const userSendsCaseMessageToJudge = (test, subject) => {
  const getHelper = () => {
    return runCompute(caseMessageModalHelper, {
      state: test.getState(),
    });
  };

  return it('internal user sends case message to judgeArmen', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseMessageModalSequence');

    await test.runSequence('updateSectionInCreateCaseMessageModalSequence', {
      key: 'toSection',
      value: 'armensChambers',
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: 'dabbad00-18d0-43ec-bafb-654e83405416', //judgeArmen
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.documentId;

    await test.runSequence('updateCaseMessageModalAttachmentsSequence', {
      documentId: messageDocument.documentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: subject,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: "don't forget to be awesome",
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
