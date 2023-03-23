import { CASE_STATUS_TYPES, PETITIONS_SECTION } from './EntityConstants';
import { MessageResult } from './MessageResult';
import { applicationContext } from '../test/createTestApplicationContext';

describe('MessageResult', () => {
  const mockRawMessageResult = {
    caseStatus: CASE_STATUS_TYPES.generalDocket,
    caseTitle: 'The Land Before Time',
    createdAt: '2019-03-01T21:40:46.415Z',
    docketNumber: '123-20',
    docketNumberWithSuffix: '123-45S',
    from: 'Test Petitionsclerk',
    fromSection: PETITIONS_SECTION,
    fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
    isCompleted: false,
    isRead: false,
    isRepliedTo: false,
    message: 'hey there',
    messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
    parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
    subject: 'hello',
    to: 'Test Petitionsclerk2',
    toSection: PETITIONS_SECTION,
    toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
    trialDate: '2029-03-01T21:40:46.415Z',
    trialLocation: 'Denver, Colorado',
  };

  it('should create a valid MessageResult', () => {
    const messageResult = new MessageResult(mockRawMessageResult, {
      applicationContext,
    });

    expect(messageResult.isValid()).toBeTruthy();
  });

  it('should fail validation when trialLocation is not one of TRIAL_CITY_STRINGS or StandaloneRemote', () => {
    const messageResult = new MessageResult(
      { ...mockRawMessageResult, trialLocation: 'New Delhi, India' },
      {
        applicationContext,
      },
    );

    expect(messageResult.isValid()).toBeFalsy();
  });
});
