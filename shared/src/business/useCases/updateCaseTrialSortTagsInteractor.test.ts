import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateCaseTrialSortTagsInteractor } from './updateCaseTrialSortTagsInteractor';

describe('Update case trial sort tags', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(mockCase));
  });

  it('does not call persistence if case status is not ready for trial', async () => {
    await updateCaseTrialSortTagsInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('calls persistence if case status is ready for trial', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;

    await updateCaseTrialSortTagsInteractor(
      applicationContext,
      {
        docketNumber: mockCase.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    await expect(
      updateCaseTrialSortTagsInteractor(
        applicationContext,
        {
          docketNumber: mockCase.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('case not found if docketNumber does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      updateCaseTrialSortTagsInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        },
        mockPetitionsClerkUser,
      ),
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
        ({ caseToUpdate }) =>
          new Case(caseToUpdate, { authorizedUser: mockDocketClerkUser }),
      );

    await expect(
      updateCaseTrialSortTagsInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
