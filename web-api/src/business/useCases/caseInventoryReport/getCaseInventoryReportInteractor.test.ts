import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_NUMBER_SUFFIXES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseInventoryReportInteractor } from './getCaseInventoryReportInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getCaseInventoryReportInteractor', () => {
  it('throws an error if user is not authorized for case inventory report', async () => {
    await expect(
      getCaseInventoryReportInteractor(
        applicationContext,
        {
          associatedJudge: CHIEF_JUDGE,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('throws an error if associatedJudge and status are not passed in', async () => {
    await expect(
      getCaseInventoryReportInteractor(
        applicationContext,
        {},
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Either judge or status must be provided');
  });

  it('calls getCaseInventoryReport useCaseHelper with appropriate params and returns its result', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseInventoryReport.mockReturnValue([
        {
          associatedJudge: CHIEF_JUDGE,
          caseCaption: 'A Test Caption',
          docketNumber: '123-20',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          status: CASE_STATUS_TYPES.new,
        },
      ]);

    const result = await getCaseInventoryReportInteractor(
      applicationContext,
      {
        associatedJudge: CHIEF_JUDGE,
        status: CASE_STATUS_TYPES.new,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseInventoryReport,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: CHIEF_JUDGE,
      status: CASE_STATUS_TYPES.new,
    });
    expect(result).toEqual([
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: 'A Test Caption',
        docketNumber: '123-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });
});
