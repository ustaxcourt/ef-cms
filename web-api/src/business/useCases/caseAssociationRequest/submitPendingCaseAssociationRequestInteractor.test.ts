import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { submitPendingCaseAssociationRequestInteractor } from './submitPendingCaseAssociationRequestInteractor';

describe('submitPendingCaseAssociationRequest', () => {
  let caseRecord = {
    docketNumber: '123-19',
  };

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.adc,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already associated', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await submitPendingCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toHaveBeenCalled();
  });

  it('should not add mapping if these is already a pending association', async () => {
    await submitPendingCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
    });

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

    await submitPendingCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).toHaveBeenCalled();
  });
});
