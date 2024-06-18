import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { replyToMessageInteractor } from './replyToMessageInteractor';

describe('replyToMessageInteractor', () => {
  const mockAttachments = [
    {
      documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
    },
    {
      documentId: 'b1130321-0a69-43bc-b3eb-64a18f079873',
    },
  ];

  it('throws unauthorized for a user without MESSAGES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: '9bd0308c-2b06-4589-b36e-242398bea31b',
    });

    await expect(
      replyToMessageInteractor(applicationContext, {
        attachments: mockAttachments,
        docketNumber: '123-45',
        message: "How's it going?",
        parentMessageId: '62ea7e6e-8101-4e4b-9bbd-932b149c86c3',
        subject: 'Hey!',
        toSection: PETITIONS_SECTION,
        toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates the message reply and marks the parent message as replied to', async () => {
    const messageData = {
      docketNumber: '123-45',
      message: "How's it going?",
      parentMessageId: '62ea7e6e-8101-4e4b-9bbd-932b149c86c3',
      subject: 'Hey!',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
    });
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      })
      .mockReturnValueOnce({
        name: 'Test Petitionsclerk2',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'd90c8a79-9628-4ca9-97c6-02a161a02904',
      });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Guy Fieri, Petitioner',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
        status: CASE_STATUS_TYPES.generalDocket,
      });

    await replyToMessageInteractor(applicationContext, {
      ...messageData,
      attachments: mockAttachments,
    });

    expect(
      applicationContext.getPersistenceGateway().upsertMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().upsertMessage.mock.calls[0][0]
        .message,
    ).toMatchObject({
      ...messageData,
      attachments: mockAttachments,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Guy Fieri',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'Test Petitionsclerk',
      fromSection: PETITIONS_SECTION,
      fromUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      to: 'Test Petitionsclerk2',
    });
    expect(
      applicationContext.getPersistenceGateway().markMessageThreadRepliedTo,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().markMessageThreadRepliedTo.mock
        .calls[0][0],
    ).toMatchObject({
      parentMessageId: messageData.parentMessageId,
    });
  });
});
