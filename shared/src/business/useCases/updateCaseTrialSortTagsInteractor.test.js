const {
  updateCaseTrialSortTagsInteractor,
} = require('./updateCaseTrialSortTagsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { omit } = require('lodash');
const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('Update case trial sort tags', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(mockCase));
  });

  it('does not call persistence if case status is not ready for trial', async () => {
    await updateCaseTrialSortTagsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateCaseTrialSortMappingRecords,
    ).not.toBeCalled();
  });

  it('calls persistence if case status is ready for trial', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;

    await updateCaseTrialSortTagsInteractor({
      applicationContext,
      caseId: mockCase.caseId,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateCaseTrialSortMappingRecords,
    ).toBeCalled();
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseTrialSortTagsInteractor({
        applicationContext,
        caseId: mockCase.caseId,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(null);

    await expect(
      updateCaseTrialSortTagsInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
      }),
    ).rejects.toThrow(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(omit(mockCase, 'docketNumber'));
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(
        ({ caseToUpdate }) => new Case(caseToUpdate, { applicationContext }),
      );

    await expect(
      updateCaseTrialSortTagsInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
