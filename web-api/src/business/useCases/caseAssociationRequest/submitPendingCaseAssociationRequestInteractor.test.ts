import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockAdcUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { submitPendingCaseAssociationRequestInteractor } from './submitPendingCaseAssociationRequestInteractor';

describe('submitPendingCaseAssociationRequest', () => {
  let caseRecord = {
    docketNumber: '123-19',
  };

  it('should throw an error when not authorized', async () => {
    await expect(
      submitPendingCaseAssociationRequestInteractor(
        applicationContext,
        {
          docketNumber: caseRecord.docketNumber,
        },
        mockAdcUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already associated', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockPrivatePractitionerUser);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitPendingCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toHaveBeenCalled();
  });

  it('should not add mapping if these is already a pending association', async () => {
    await submitPendingCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);
    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(false);

    await submitPendingCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).toHaveBeenCalled();
  });
});
