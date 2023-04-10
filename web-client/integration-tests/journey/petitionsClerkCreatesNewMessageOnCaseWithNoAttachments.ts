import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

const { PETITIONS_SECTION } = applicationContext.getConstants();

export const petitionsClerkCreatesNewMessageOnCaseWithNoAttachments =
  cerebralTest => {
    return it('petitions clerk creates new message on a case with no attachments', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('openCreateMessageModalSequence');

      await cerebralTest.runSequence(
        'updateSectionInCreateMessageModalSequence',
        {
          key: 'toSection',
          value: PETITIONS_SECTION,
        },
      );

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'toUserId',
        value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
      });

      cerebralTest.testMessageSubject = `someone poisoned the coffee ${Date.now()}`;

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'subject',
        value: cerebralTest.testMessageSubject,
      });

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'message',
        value: 'do not drink the coffee',
      });

      await cerebralTest.runSequence('createMessageSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await refreshElasticsearchIndex();
    });
  };
