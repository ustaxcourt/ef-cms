import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { createMessageAsReply as createMessageAsReplyMock } from '@web-api/persistence/postgres/messages/createMessageAsReply';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { replyToMessageInteractor } from './replyToMessageInteractor';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

const createMessageAsReply = createMessageAsReplyMock as jest.Mock;
const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getUserById = getUserByIdMock as jest.Mock;

describe('replyToMessageInteractor', () => {
  const mockAttachments = [
    {
      documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
    },
    {
      documentId: 'b1130321-0a69-43bc-b3eb-64a18f079873',
    },
  ];

  it('should throw unauthorized for a user without MESSAGES permission', async () => {
    await expect(
      replyToMessageInteractor(
        {
          attachments: mockAttachments,
          docketNumber: '101-20',
          message: "How's it going?",
          parentMessageId: '62ea7e6e-8101-4e4b-9bbd-932b149c86c3',
          subject: 'Hey!',
          toSection: PETITIONS_SECTION,
          toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should create the message reply and mark the parent message as replied to', async () => {
    const messageData = {
      docketNumber: '101-20',
      message: "How's it going?",
      parentMessageId: '62ea7e6e-8101-4e4b-9bbd-932b149c86c3',
      subject: 'Hey!',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
    getUserById
      .mockReturnValueOnce({
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

    getCaseByDocketNumber.mockResolvedValue({
      caseCaption: 'Roslindis Angelino, Petitioner',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      status: CASE_STATUS_TYPES.generalDocket,
    });

    await replyToMessageInteractor(
      {
        ...messageData,
        attachments: mockAttachments,
      },
      mockPetitionsClerkUser,
    );

    expect(createMessageAsReply).toHaveBeenCalled();
    expect(
      (createMessageAsReply as jest.Mock).mock.calls[0][0].newMessage,
    ).toMatchObject({
      ...messageData,
      attachments: mockAttachments,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'Roslindis Angelino',
      docketNumber: '101-20',
      from: 'Test Petitionsclerk',
      fromSection: PETITIONS_SECTION,
      fromUserId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      to: 'Test Petitionsclerk2',
    });
    expect(createMessageAsReply.mock.calls[0][0].parentMessageId).toEqual(
      messageData.parentMessageId,
    );
  });
});
