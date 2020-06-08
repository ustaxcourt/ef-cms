import { NewCaseMessage } from '../../../shared/src/business/entities/NewCaseMessage';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkCreatesNewMessageOnCase = test => {
  return it('petitions clerk creates new message on a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseMessageModalSequence');

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    test.testMessageSubject = `what kind of bear is best? ${Date.now()}`;

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'subject',
      value: test.testMessageSubject,
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      message: NewCaseMessage.VALIDATION_ERROR_MESSAGES.message,
    });

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
