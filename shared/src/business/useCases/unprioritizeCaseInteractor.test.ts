import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
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
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

describe('unprioritizeCaseInteractor', () => {
  let mockLock;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCase = updateCaseMock as jest.Mock;
  updateCase.mockImplementation(c => c.caseToUpdate);

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock.mockImplementation(
        ({ caseEntity }) => caseEntity,
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

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
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
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
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
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

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
