import '@web-api/persistence/postgres/messages/mocks.jest';
import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createMessageInteractor } from './createMessageInteractor';
import { createMessage as createMessageMock } from '@web-api/persistence/postgres/messages/createMessage';

const createMessage = createMessageMock as jest.Mock;
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('createMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    await expect(
      createMessageInteractor(
        applicationContext,
        {
          attachments: [],
          docketNumber: '101-20',
          message: 'hello world',
          subject: 'what is up',
          toSection: DOCKET_SECTION,
          toUserId: 'abc',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('creates the message', async () => {
    const mockAttachments = [
      {
        documentId: 'b1130321-0a76-43bc-b3eb-64a18f079873',
      },
      {
        documentId: 'b1130321-0a69-43bc-b3eb-64a18f079873',
      },
    ];

    const messageData = {
      docketNumber: '101-20',
      isRepliedTo: false,
      message: "How's it going?",
      subject: 'Hey!',
      toSection: PETITIONS_SECTION,
      toUserId: 'b427ca37-0df1-48ac-94bb-47aed073d6f7',
    };
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
        caseCaption: 'Roslindis Angelino, Petitioner',
        docketNumberWithSuffix: '123-45S',
        status: CASE_STATUS_TYPES.generalDocket,
      });

    await createMessageInteractor(
      applicationContext,
      {
        ...messageData,
        attachments: mockAttachments,
      },
      mockPetitionsClerkUser,
    );

    expect(createMessage).toHaveBeenCalled();
    expect(createMessage.mock.calls[0][0].message).toMatchObject({
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
  });
});
