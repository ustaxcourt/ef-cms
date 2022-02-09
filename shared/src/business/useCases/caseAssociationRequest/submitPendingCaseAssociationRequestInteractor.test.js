const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  submitPendingCaseAssociationRequestInteractor,
} = require('./submitPendingCaseAssociationRequestInteractor');
const { ROLES } = require('../../entities/EntityConstants');

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
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if practitioner is already on case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const caseDetail = {
      privatePractitioners: [
        { userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseDetail);
    // applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
    //   name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    //   role: ROLES.privatePractitioner,
    //   userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    // });
    // applicationContext
    //   .getPersistenceGateway()
    //   .verifyCaseForUser.mockReturnValue(true);

    const results = submitPendingCaseAssociationRequestInteractor(
      applicationContext,
      {
        docketNumber: caseRecord.docketNumber,
      },
    );

    await expect(results).rejects.toThrow(
      `The Private Practitioner is already associated with case ${caseRecord.docketNumber}.`,
    );

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toBeCalled();
  });

  it('should not add mapping if there is already a pending association', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const caseDetail = {
      privatePractitioners: [],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseDetail);

    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(true);

    await expect(
      submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber: caseRecord.docketNumber,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toBeCalled();
  });

  it('should add mapping', async () => {
    const caseDetail = {
      privatePractitioners: [],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseDetail);

    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(false);

    await submitPendingCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).toBeCalled();
  });
});
