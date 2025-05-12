import '@web-api/persistence/postgres/users/mocks.jest';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { MOCK_PRACTITIONER, petitionerUser } from '@shared/test/mockUsers';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { queueUpdateAssociatedCasesWorker } from './queueUpdateAssociatedCasesWorker';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

const getDocketNumbersByUser = getDocketNumbersByUserMock as jest.Mock;

describe('queueUpdateAssociatedCasesWorker', () => {
  it('should lookup the docket numbers for the current user', async () => {
    getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: MOCK_PRACTITIONER,
      },
      {
        email: MOCK_PRACTITIONER.email!,
        name: MOCK_PRACTITIONER.name,
        role: MOCK_PRACTITIONER.role,
        userId: MOCK_PRACTITIONER.userId,
      },
    );

    expect(getDocketNumbersByUser).toHaveBeenCalledWith({
      userId: MOCK_PRACTITIONER.userId,
    });
  });

  it('should return an object that includes all of the docketNumbers associated with the practitioner', async () => {
    getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getWorkerGateway().queueWork.mockReturnValue({});
    const authorizedUser = {
      email: MOCK_PRACTITIONER.email!,
      name: MOCK_PRACTITIONER.name,
      role: MOCK_PRACTITIONER.role,
      userId: MOCK_PRACTITIONER.userId,
    };

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: MOCK_PRACTITIONER,
      },
      authorizedUser,
    );

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '111-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '222-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '333-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });

  it('should attempt to send a message to update the petitioner cases via the worker gateway', async () => {
    getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getWorkerGateway().queueWork.mockReturnValue({});
    const authorizedUser = {
      email: petitionerUser.email || 'petitioner@example.com',
      name: petitionerUser.name,
      role: petitionerUser.role,
      userId: petitionerUser.userId,
    };

    await queueUpdateAssociatedCasesWorker(
      applicationContext,
      {
        user: petitionerUser,
      },
      authorizedUser,
    );

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '111-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '222-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketNumber: '333-20', user: petitionerUser },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });
});
