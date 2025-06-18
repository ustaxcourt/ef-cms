import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  OBJECTIONS_OPTIONS_MAP,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateCourtIssuedDocketEntryInteractor } from './updateCourtIssuedDocketEntryInteractor';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('updateCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeAll(() => {
    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: '45678-18',
          documentType: 'Order',
          eventCode: 'O',
          filedByRole: ROLES.docketClerk,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
          workItem: {
            assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
            assigneeName: 'bob',
            caseStatus: CASE_STATUS_TYPES.new,
            caseTitle: 'Johnny Joe Jacobson',
            docketEntry: {},
            docketNumber: '101-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
            messages: [],
            section: DOCKET_SECTION,
            sentBy: 'bob',
          },
        },
      ],
    };

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    getCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    await expect(
      updateCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          documentMeta: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            docketNumber: caseRecord.docketNumber,
            documentType: 'Memorandum in Support',
            eventCode: 'MISP',
          },
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    await expect(
      updateCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          documentMeta: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            docketNumber: caseRecord.docketNumber,
            documentType: 'Order',
            eventCode: 'O',
            signedAt: '2019-03-01T21:40:46.415Z',
            signedByUserId: mockUserId,
            signedJudgeName: 'Dredd',
          },
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Document not found');
  });

  it('should call updateCase and saveWorkItem', async () => {
    await updateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
          eventCode: 'O',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(upsertWorkItems).toHaveBeenCalled();
  });

  it('should not update non-editable fields on the document', async () => {
    await updateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
          eventCode: 'O',
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries[0]
        .objections,
    ).toBeUndefined();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      updateCourtIssuedDocketEntryInteractor(
        applicationContext,
        {
          documentMeta: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
            docketNumber: caseRecord.docketNumber,
            documentType: 'Order',
            eventCode: 'O',
            signedAt: '2019-03-01T21:40:46.415Z',
            signedByUserId: mockUserId,
            signedJudgeName: 'Dredd',
          },
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await updateCourtIssuedDocketEntryInteractor(
      applicationContext,
      {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
          eventCode: 'O',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${caseRecord.docketNumber}`],
      }),
    );
  });
});
