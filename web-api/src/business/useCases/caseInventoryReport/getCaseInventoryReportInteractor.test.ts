import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_NUMBER_SUFFIXES,
} from '@shared/business/entities/EntityConstants';
import { getCaseInventoryReportInteractor } from './getCaseInventoryReportInteractor';
import { getCaseInventoryReport as getCaseInventoryReportMock } from '@web-api/persistence/postgres/cases/reports/getCaseInventoryReport';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getCaseInventoryReportInteractor', () => {
  const getCaseInventoryReport = getCaseInventoryReportMock as jest.Mock;
  it('should throw an error when user is not authorized for case inventory report', async () => {
    await expect(
      getCaseInventoryReportInteractor(
        {
          associatedJudge: CHIEF_JUDGE,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('should throw an error when associatedJudge and status are not passed in', async () => {
    await expect(
      getCaseInventoryReportInteractor({}, mockDocketClerkUser),
    ).rejects.toThrow('Either judge or status must be provided');
  });

  it('should call getCaseInventoryReport with appropriate params and return its result', async () => {
    getCaseInventoryReport.mockReturnValue([
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: 'A Test Caption',
        docketNumber: '123-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        status: CASE_STATUS_TYPES.new,
      },
    ]);

    const result = await getCaseInventoryReportInteractor(
      {
        associatedJudge: CHIEF_JUDGE,
        status: CASE_STATUS_TYPES.new,
      },
      mockDocketClerkUser,
    );

    expect(getCaseInventoryReport).toHaveBeenCalledWith({
      associatedJudge: CHIEF_JUDGE,
      page: 0,
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
