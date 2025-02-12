import '@web-api/persistence/postgres/cases/mocks.jest';

import {
  MAX_ITERATIONS,
  queueEmailUpdateAssociatedCasesWorker,
} from '@web-api/business/useCases/user/queueEmailUpdateAssociatedCasesWorker';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { petitionerUser } from '@shared/test/mockUsers';
import { sleep } from '@shared/tools/helpers';
import { getCasesByEmailTotal as getCasesByEmailTotalMock } from '@web-api/persistence/postgres/cases/reports/getCasesByEmailTotal';

const getCasesByEmailTotal = getCasesByEmailTotalMock as jest.Mock;

describe('queueEmailUpdateAssociatedCasesWorker', () => {
  let TEST_USER: RawUser;
  let RESOLVER: Function;

  beforeEach(() => {
    TEST_USER = {
      ...petitionerUser,
      isUpdatingInformation: true,
    };

    applicationContext.getPersistenceGateway().updateUser.mockReturnValue(null);

    applicationContext
      .getUseCases()
      .queueUpdateAssociatedCasesWorker.mockReturnValue(null);

    getCasesByEmailTotal.mockImplementation(
      () =>
        new Promise(resolve => {
          RESOLVER = resolve;
        }),
    );

    applicationContext.getUtilities().sleep.mockImplementation(() => {});
  });

  it('should disable user flag and short circuit if there is no associated cases to user', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([]);

    await queueEmailUpdateAssociatedCasesWorker(
      applicationContext,
      { user: TEST_USER },
      mockPetitionerUser,
    );

    const updateUserCalls =
      applicationContext.getPersistenceGateway().updateUser.mock.calls;
    expect(updateUserCalls.length).toEqual(1);
    expect(updateUserCalls[0][0].user).toMatchObject({
      isUpdatingInformation: false,
    });

    const queueUpdateAssociatedCasesWorkerCalls =
      applicationContext.getUseCases().queueUpdateAssociatedCasesWorker.mock
        .calls;
    expect(queueUpdateAssociatedCasesWorkerCalls.length).toEqual(0);
  });

  function assertFunctionCalls(expectedCount: number) {
    expect(
      applicationContext.getPersistenceGateway().getDocketNumbersByUser.mock
        .calls.length,
    ).toEqual(expectedCount + 1);

    expect(getCasesByEmailTotal.mock.calls.length).toEqual(expectedCount);
  }

  it('should call "queueUpdateAssociatedCasesWorker" with user information and wait until all expected cases to update', async () => {
    const TEST_DOCKER_NUMBERS = ['TEST_1', 'TEST_2', 'TEST_3', 'TEST_4'];
    let COMPLETE_FLAG = false;
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(TEST_DOCKER_NUMBERS);

    void queueEmailUpdateAssociatedCasesWorker(
      applicationContext,
      { user: TEST_USER },
      mockPetitionerUser,
    ).then(() => {
      const queueUpdateAssociatedCasesWorkerCalls =
        applicationContext.getUseCases().queueUpdateAssociatedCasesWorker.mock
          .calls;

      expect(queueUpdateAssociatedCasesWorkerCalls.length).toEqual(1);
      expect(queueUpdateAssociatedCasesWorkerCalls[0][1]).toEqual({
        user: TEST_USER,
      });
      expect(queueUpdateAssociatedCasesWorkerCalls[0][2]).toEqual(
        mockPetitionerUser,
      );

      const updateUserCalls =
        applicationContext.getPersistenceGateway().updateUser.mock.calls;
      expect(updateUserCalls.length).toEqual(1);
      expect(updateUserCalls[0][0].user).toMatchObject({
        isUpdatingInformation: false,
      });

      COMPLETE_FLAG = true;
    });

    await sleep(100);
    assertFunctionCalls(1);
    RESOLVER(0);

    await sleep(50);
    assertFunctionCalls(2);
    RESOLVER(2);

    await sleep(50);
    assertFunctionCalls(3);
    RESOLVER(TEST_DOCKER_NUMBERS.length);

    await sleep(50);
    expect(COMPLETE_FLAG).toEqual(true);
  });

  it('should call resolve the interactor when the max number of iterations is met', async () => {
    getCasesByEmailTotal.mockResolvedValue({});

    const TEST_DOCKER_NUMBERS = ['TEST_1', 'TEST_2', 'TEST_3', 'TEST_4'];
    let COMPLETE_FLAG = false;
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(TEST_DOCKER_NUMBERS);

    void queueEmailUpdateAssociatedCasesWorker(
      applicationContext,
      { user: TEST_USER },
      mockPetitionerUser,
    ).then(() => {
      COMPLETE_FLAG = true;
    });

    await sleep(100);
    expect(COMPLETE_FLAG).toEqual(true);

    const getCasesByEmailTotalCalls = getCasesByEmailTotal.mock.calls;

    expect(getCasesByEmailTotalCalls.length).toEqual(MAX_ITERATIONS + 1);
  });

  it('should resolve the interactor when the there is an error thrown in the check method', async () => {
    getCasesByEmailTotal.mockImplementation(() => {
      throw Error('TEST ERROR');
    });

    const TEST_DOCKER_NUMBERS = ['TEST_1', 'TEST_2', 'TEST_3', 'TEST_4'];
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(TEST_DOCKER_NUMBERS);

    await queueEmailUpdateAssociatedCasesWorker(
      applicationContext,
      { user: TEST_USER },
      mockPetitionerUser,
    );

    const updateUserCalls =
      applicationContext.getPersistenceGateway().updateUser.mock.calls;
    expect(updateUserCalls.length).toEqual(1);
    expect(updateUserCalls[0][0].user).toMatchObject({
      isUpdatingInformation: false,
    });
  });
});
