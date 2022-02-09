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
  let mockCurrentUser;
  let caseDetail;

  beforeEach(() => {
    mockCurrentUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    caseDetail = {
      privatePractitioners: [],
    };
    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseDetail);
  });

  it('should throw an error when not authorized', async () => {
    mockCurrentUser.role = ROLES.adc;

    await expect(
      submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber: caseRecord.docketNumber,
        userId: mockCurrentUser.userId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if practitioner is already on case', async () => {
    caseDetail.privatePractitioners = [{ userId: mockCurrentUser.userId }];

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
    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(true);

    await expect(
      submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber: caseRecord.docketNumber,
        userId: mockCurrentUser.userId,
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).not.toBeCalled();
  });

  it('should add mapping', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyPendingCaseForUser.mockReturnValue(false);

    await submitPendingCaseAssociationRequestInteractor(applicationContext, {
      docketNumber: caseRecord.docketNumber,
      userId: mockCurrentUser.userId,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCasePending,
    ).toBeCalled();
  });
});
