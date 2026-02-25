import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { createMessageInteractor } from './createMessageInteractor';
import { createMessage as createMessageMock } from '@web-api/persistence/postgres/messages/createMessage';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const createMessage = createMessageMock as jest.Mock;
const getUserById = jest.mocked(getUserByIdMock);

describe('createMessageInteractor', () => {
  it('throws unauthorized for a user without MESSAGES permission', async () => {
    await expect(
      createMessageInteractor(
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
    getUserById
      .mockResolvedValueOnce({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      } as DbUser)
      .mockResolvedValueOnce({
        name: 'Test Petitionsclerk2',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'd90c8a79-9628-4ca9-97c6-02a161a02904',
      } as DbUser);

    getCaseByDocketNumber.mockReturnValue({
      caseCaption: 'Roslindis Angelino, Petitioner',
      docketNumberWithSuffix: '123-45S',
      status: CASE_STATUS_TYPES.generalDocket,
    });

    await createMessageInteractor(
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

  it('throws NotFoundError when the case is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue(undefined);

    await expect(
      createMessageInteractor(
        {
          attachments: [],
          docketNumber: '999-99',
          message: 'hello',
          subject: 'test',
          toSection: PETITIONS_SECTION,
          toUserId: 'abc',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError when the fromUser is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      caseCaption: 'Test Caption, Petitioner',
      status: CASE_STATUS_TYPES.generalDocket,
    });
    getUserById.mockResolvedValueOnce(undefined as unknown as DbUser);

    await expect(
      createMessageInteractor(
        {
          attachments: [],
          docketNumber: '101-20',
          message: 'hello',
          subject: 'test',
          toSection: PETITIONS_SECTION,
          toUserId: 'abc',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError when the toUser is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      caseCaption: 'Test Caption, Petitioner',
      status: CASE_STATUS_TYPES.generalDocket,
    });
    getUserById
      .mockResolvedValueOnce({
        name: 'Test Petitionsclerk',
        role: ROLES.petitionsClerk,
        section: PETITIONS_SECTION,
        userId: 'b9fcabc8-3c83-4cbf-9f4a-d2ecbdc591e1',
      } as DbUser)
      .mockResolvedValueOnce(undefined as unknown as DbUser);

    await expect(
      createMessageInteractor(
        {
          attachments: [],
          docketNumber: '101-20',
          message: 'hello',
          subject: 'test',
          toSection: PETITIONS_SECTION,
          toUserId: 'non-existent-user-id',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });
});
