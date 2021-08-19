import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();
const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const docketClerkCreatesMessageWithCorrespondence = cerebralTest => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: cerebralTest.getState(),
    });
  };

  it('docketclerk creates a message with correspondence document attached', async () => {
    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5', //colvinsChambers
    });

    const correspondence = getHelper().correspondence.find(
      c =>
        c.correspondenceId ===
        cerebralTest.correspondenceDocument.correspondenceId,
    );

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: correspondence.correspondenceId,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'are we human?',
    });

    await cerebralTest.runSequence('createMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
