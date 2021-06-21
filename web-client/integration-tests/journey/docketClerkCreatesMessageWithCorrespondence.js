import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();
const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const docketClerkCreatesMessageWithCorrespondence = test => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: test.getState(),
    });
  };

  it('docketclerk creates a message with correspondence document attached', async () => {
    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5', //colvinsChambers
    });

    const correspondence = getHelper().correspondence.find(
      c => c.correspondenceId === test.correspondenceDocument.correspondenceId,
    );

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: correspondence.correspondenceId,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'are we human?',
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
