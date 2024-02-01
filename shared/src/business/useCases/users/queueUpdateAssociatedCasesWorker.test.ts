// import { MOCK_CASE } from '../../../test/mockCase';
// import { MOCK_LOCK } from '../../../test/mockLock';
// import { MOCK_PRACTITIONER, validUser } from '../../../test/mockUsers';
// import { ROLES, SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
// import { ServiceUnavailableError } from '@web-api/errors/errors';

// import { getContactPrimary } from '../../entities/cases/Case';
// import { queueUpdateAssociatedCasesWorker } from './queueUpdateAssociatedCasesWorker';

import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { applicationContext } from '../../test/createTestApplicationContext';
import { queueUpdateAssociatedCasesWorker } from '@shared/business/useCases/users/queueUpdateAssociatedCasesWorker';

describe('queueUpdateAssociatedCasesWorker', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);
  });

  it('should lookup the docket numbers for the current user', async () => {
    await queueUpdateAssociatedCasesWorker(applicationContext, {
      user: MOCK_PRACTITIONER,
    });

    expect(
      await applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: MOCK_PRACTITIONER.userId,
    });
  });

  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    applicationContext.getWorkerGateway().initialize.mockReturnValue({});

    await queueUpdateAssociatedCasesWorker(applicationContext, {
      user: MOCK_PRACTITIONER,
    });

    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '111-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '222-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
    expect(
      applicationContext.getWorkerGateway().initialize,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        payload: { docketNumber: '333-20', user: MOCK_PRACTITIONER },
        type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
      },
    });
  });
});

// describe('queueUpdateAssociatedCasesWorker', () => {
//   const UPDATED_EMAIL = 'other@example.com';
//   const USER_ID = '7a0c9454-5f1a-438a-8c8a-f7560b119343';
//   const mockPetitioner = {
//     ...validUser,
//     birthYear: '1950',
//     email: undefined,
//     firstName: 'Alden',
//     lastName: 'Rivas',
//     name: 'Alden Rivas',
//     originalBarState: 'FL',
//     pendingEmail: UPDATED_EMAIL,
//     role: ROLES.petitioner,
//     userId: USER_ID,
//   };

//   const mockPractitioner = {
//     ...MOCK_PRACTITIONER,
//     email: undefined,
//     pendingEmail: UPDATED_EMAIL,
//     serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
//   };
//   const mockCase = {
//     ...MOCK_CASE,
//     docketNumber: '101-21',
//     petitioners: [
//       {
//         ...getContactPrimary(MOCK_CASE),
//         contactId: USER_ID,
//         email: undefined,
//         serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
//       },
//     ],
//     privatePractitioners: [mockPractitioner],
//   };
//   let mockLock;

//   beforeAll(() => {
//     applicationContext
//       .getPersistenceGateway()
//       .getLock.mockImplementation(() => mockLock);
//   });

//   beforeEach(() => {
//     mockLock = undefined;
//     applicationContext
//       .getPersistenceGateway()
//       .updateUser.mockReturnValue(mockPetitioner);

//     applicationContext
//       .getPersistenceGateway()
//       .getDocketNumbersByUser.mockReturnValue([mockCase.docketNumber]);

//     applicationContext
//       .getPersistenceGateway()
//       .getCaseByDocketNumber.mockReturnValue(mockCase);
//   });

//   it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined, and service indicator set to electronic with a practitioner user', async () => {
//     await queueUpdateAssociatedCasesWorker(applicationContext, {
//       user: {
//         ...mockPractitioner,
//         email: UPDATED_EMAIL,
//         serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
//       },
//     });

//     expect(
//       applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
//         .user,
//     ).toMatchObject({
//       email: UPDATED_EMAIL,
//       entityName: 'Practitioner',
//       pendingEmail: undefined,
//       serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
//     });
//   });

//   it('should call updateUser with email set to pendingEmail and pendingEmail set to undefined', async () => {
//     await queueUpdateAssociatedCasesWorker(applicationContext, {
//       user: mockPetitioner,
//     });

//     expect(
//       applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
//         .user,
//     ).toMatchObject({
//       email: UPDATED_EMAIL,
//       pendingEmail: undefined,
//     });
//   });

//   it('should attempt to send a message to update the petitioner cases via the message gateway', async () => {
//     await queueUpdateAssociatedCasesWorker(applicationContext, {
//       user: mockPetitioner,
//     });

//     // TODO 10007: Replaced with worker gateway
//     // expect(
//     //   applicationContext.getMessageGateway().sendUpdatePetitionerCasesMessage,
//     // ).toHaveBeenCalled();
//   });

//   it('should update the user cases with the new email and electronic service for a practitioner', async () => {
//     await queueUpdateAssociatedCasesWorker(applicationContext, {
//       user: mockPractitioner,
//     });

//     const { caseToUpdate } =
//       applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
//         .calls[0][0];

//     expect(applicationContext.logger.error).not.toHaveBeenCalled();
//     expect(caseToUpdate.privatePractitioners[0]).toMatchObject({
//       email: UPDATED_EMAIL,
//       serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
//     });
//   });

//   it('should log an error when the user is not found on one of their associated cases by userId', async () => {
//     const mockErrorMessage = 'updateCaseAndAssociations failure';

//     applicationContext
//       .getUseCaseHelpers()
//       .updateCaseAndAssociations.mockRejectedValueOnce(
//         new Error(mockErrorMessage),
//       );

//     await expect(
//       queueUpdateAssociatedCasesWorker(applicationContext, {
//         user: mockPractitioner,
//       }),
//     ).rejects.toThrow(mockErrorMessage);
//   });

//   it('should not turn an inactive Practitioner into a User', async () => {
//     await queueUpdateAssociatedCasesWorker(applicationContext, {
//       user: {
//         ...mockPractitioner,
//         email: UPDATED_EMAIL,
//         role: ROLES.inactivePractitioner,
//         serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
//       },
//     });

//     expect(
//       applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
//         .user,
//     ).toMatchObject({
//       email: UPDATED_EMAIL,
//       entityName: 'Practitioner',
//       pendingEmail: undefined,
//       serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
//     });
//   });

//   describe('locking', () => {
//     it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
//       mockLock = MOCK_LOCK;

//       await expect(
//         queueUpdateAssociatedCasesWorker(applicationContext, {
//           user: mockPractitioner,
//         }),
//       ).rejects.toThrow(ServiceUnavailableError);

//       expect(
//         applicationContext.getPersistenceGateway().getCaseByDocketNumber,
//       ).not.toHaveBeenCalled();
//     });

//     it('should acquire and remove the lock on the case', async () => {
//       await queueUpdateAssociatedCasesWorker(applicationContext, {
//         user: mockPractitioner,
//       });

//       expect(
//         applicationContext.getPersistenceGateway().createLock,
//       ).toHaveBeenCalledWith({
//         applicationContext,
//         identifier: `case|${mockCase.docketNumber}`,
//         ttl: 30,
//       });

//       expect(
//         applicationContext.getPersistenceGateway().removeLock,
//       ).toHaveBeenCalledWith({
//         applicationContext,
//         identifiers: [`case|${mockCase.docketNumber}`],
//       });
//     });
//   });
// });
