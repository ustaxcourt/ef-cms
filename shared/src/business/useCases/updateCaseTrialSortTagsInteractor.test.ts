import '@web-api/persistence/postgres/cases/mocks.jest';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateCaseTrialSortTagsInteractor } from './updateCaseTrialSortTagsInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

describe('Update case trial sort tags', () => {
  let mockCase;
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  beforeEach(() => {
    mockCase = MOCK_CASE;

    getCaseByDocketNumber.mockResolvedValue(mockCase);
  });

  it('should not call persistence if case status is not ready for trial', async () => {
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

  it('should call persistence if case status is ready for trial', async () => {
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

  it('should throw unauthorized error if user is unauthorized', async () => {
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

  it('thould throw case not found if docketNumber does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue(null);

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

  it('should throw an error if the entity returned from persistence is invalid', async () => {
    mockCase.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
    getCaseByDocketNumber.mockResolvedValue(omit(mockCase, 'docketNumber'));

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
