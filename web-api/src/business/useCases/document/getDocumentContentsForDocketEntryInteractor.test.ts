import { ROLES } from '@shared/business/entities/EntityConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentContentsForDocketEntryInteractor } from './getDocumentContentsForDocketEntryInteractor';
import {
  mockDocketClerkUser,
  mockJudgeUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getDocumentContentsForDocketEntryInteractor', () => {
  const mockDocumentContentsId = '599dbad3-4912-4a61-9525-3da245700893';
  beforeEach(() => {
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );
  });

  it('should throw an error when the logged in user does not have permission to EDIT_ORDER', async () => {
    let authorizedUser = {
      ...mockPrivatePractitionerUser,
      role: ROLES.inactivePractitioner,
    } as UnknownAuthUser;
    await expect(
      getDocumentContentsForDocketEntryInteractor(
        applicationContext,
        {
          documentContentsId: mockDocumentContentsId,
        },
        authorizedUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should allow the logged in internal user with permissions to edit the order', async () => {
    await getDocumentContentsForDocketEntryInteractor(
      applicationContext,
      {
        documentContentsId: mockDocumentContentsId,
      },
      mockJudgeUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
    ).toMatchObject({ key: mockDocumentContentsId });
  });

  it('should call applicationContext.getPersistenceGateway().getDocument with documentCntentsId as the key', async () => {
    await getDocumentContentsForDocketEntryInteractor(
      applicationContext,
      {
        documentContentsId: mockDocumentContentsId,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
    ).toMatchObject({ key: mockDocumentContentsId });
  });

  it('should return the documentContents as parsed JSON data', async () => {
    const result = await getDocumentContentsForDocketEntryInteractor(
      applicationContext,
      {
        documentContentsId: mockDocumentContentsId,
      },
      mockDocketClerkUser,
    );

    expect(result).toEqual({
      documentContents: 'the contents!',
      richText: '<b>the contents!</b>',
    });
  });

  it('should throw an error when the document contents cannot be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValueOnce(
        new Error(
          `Document contents ${mockDocumentContentsId} could not be found in the S3 bucket.`,
        ),
      );

    await expect(
      getDocumentContentsForDocketEntryInteractor(
        applicationContext,
        {
          documentContentsId: mockDocumentContentsId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      `Document contents ${mockDocumentContentsId} could not be found in the S3 bucket.`,
    );
  });
});
