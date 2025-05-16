jest.mock('@web-api/persistence/dynamo/locks/acquireLock');
jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
);
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { unprioritizeCaseInteractor } from './unprioritizeCaseInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { getLock as mockGetLock } from '@web-api/persistence/dynamo/locks/acquireLock';
import { updateCaseAutomaticBlock as updateCaseAutomaticBlockMock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { createCaseTrialSortMappingRecords as createCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('unprioritizeCaseInteractor', () => {
  let mockLock;
  const getLock = jest.mocked(mockGetLock);
  const updateCaseAutomaticBlock = jest.mocked(updateCaseAutomaticBlockMock);
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const createCaseTrialSortMappingRecords = jest.mocked(
    createCaseTrialSortMappingRecordsMock,
  );
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);

  beforeAll(() => {
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
    getLock.mockImplementation(() => mockLock);

    updateCaseAutomaticBlock.mockImplementation(({ caseEntity }) =>
      Promise.resolve(caseEntity),
    );
  });

  beforeEach(() => {
    mockLock = undefined;
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

  it('should set the highPriority flag to false and remove the highPriorityReason and call createCaseTrialSortMappingRecords if the case status is ready for trial', async () => {
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
    expect(deleteCaseTrialSortMappingRecords).not.toHaveBeenCalled();
    expect(createCaseTrialSortMappingRecords).toHaveBeenCalled();
    expect(
      createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should set the highPriority flag to false and remove the highPriorityReason and call deleteCaseTrialSortMappingRecords if the case status is NOT ready for trial', async () => {
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
    expect(createCaseTrialSortMappingRecords).not.toHaveBeenCalled();
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
    expect(
      deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;
    applicationContext
      .getPersistenceGateway()
      .getLock.mockResolvedValueOnce(mockLock);

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
    mockLock = undefined;
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    await unprioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
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
});
