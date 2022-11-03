import { CASE_STATUS_TYPES, ROLES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { MOCK_CASE } from '../../test/mockCase';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { omit } from 'lodash';
import { updateCaseTrialSortTagsInteractor } from './updateCaseTrialSortTagsInteractor';

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
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(mockCase));
  });

  it('does not call persistence if case status is not ready for trial', async () => {
    await updateCaseTrialSortTagsInteractor(applicationContext, {
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('calls persistence if case status is ready for trial', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;

    await updateCaseTrialSortTagsInteractor(applicationContext, {
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseTrialSortTagsInteractor(applicationContext, {
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('case not found if docketNumber does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      updateCaseTrialSortTagsInteractor(applicationContext, {
        docketNumber: '123-45',
      }),
    ).rejects.toThrow('Case 123-45');
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(omit(mockCase, 'docketNumber'));
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(
        ({ caseToUpdate }) => new Case(caseToUpdate, { applicationContext }),
      );

    await expect(
      updateCaseTrialSortTagsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
