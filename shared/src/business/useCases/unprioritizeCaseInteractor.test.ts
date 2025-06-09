import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { unprioritizeCaseInteractor } from './unprioritizeCaseInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAutomaticBlock as updateCaseAutomaticBlockMock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

describe('unprioritizeCaseInteractor', () => {
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);
  const updateCaseAutomaticBlock = jest.mocked(updateCaseAutomaticBlockMock);
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);

  beforeAll(() => {
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );

    updateCaseAutomaticBlock.mockImplementation(({ caseEntity }) =>
      Promise.resolve(caseEntity),
    );
  });

  it('should throw an unauthorized error if the user has no access to unprioritize the case', async () => {
    await expect(
      unprioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: '123-20',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call updateCaseAutomaticBlock', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await unprioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(updateCaseAutomaticBlock).toHaveBeenCalled();
  });

  it('should set the highPriority flag to false and remove the highPriorityReason if the case status is ready for trial', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      highPriority: true,
      highPriorityReason: 'because',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    const result = await unprioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      highPriority: false,
      highPriorityReason: undefined,
    });
  });

  it('should set the highPriority flag to false and remove the highPriorityReason if the case status is NOT ready for trial', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      highPriority: true,
      highPriorityReason: 'because',
      status: CASE_STATUS_TYPES.new,
    });

    const result = await unprioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      highPriority: false,
      highPriorityReason: undefined,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      unprioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    await unprioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
