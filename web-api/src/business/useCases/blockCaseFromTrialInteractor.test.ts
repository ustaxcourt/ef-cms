jest.mock('@web-api/persistence/dynamo/cases/getCaseByDocketNumber');
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { blockCaseFromTrialInteractor } from './blockCaseFromTrialInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';

describe('blockCaseFromTrialInteractor', () => {
  let mockLock;
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    updateCaseAndAssociations.mockImplementation(
      ({ caseToUpdate }) => caseToUpdate,
    );
    mockLock = undefined;
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    const result = await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      blocked: true,
      blockedReason: 'just because',
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
    expect(
      deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      blockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          reason: 'just because',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should throw an unauthorized error if the user has no access to block cases', async () => {
    await expect(
      blockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });
});
