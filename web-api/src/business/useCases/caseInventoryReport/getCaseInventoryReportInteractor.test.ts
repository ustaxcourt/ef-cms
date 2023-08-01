import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseInventoryReportInteractor } from './getCaseInventoryReportInteractor';

describe('getCaseInventoryReportInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: '9754a349-1013-44fa-9e61-d39aba2637e0',
    });
  });

  it('throws an error if user is not authorized for case inventory report', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner, //petitioner does not have CASE_INVENTORY_REPORT permission
      userId: '8e20dd1b-d142-40f4-8362-6297f1be68bf',
    });

    await expect(
      getCaseInventoryReportInteractor(applicationContext, {
        associatedJudge: CHIEF_JUDGE,
      }),
    ).rejects.toThrow('Unauthorized for case inventory report');
  });

  it('throws an error if associatedJudge and status are not passed in', async () => {
    await expect(
      getCaseInventoryReportInteractor(applicationContext, {}),
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
          status: CASE_STATUS_TYPES.NEW,
        },
      ]);

    const result = await getCaseInventoryReportInteractor(applicationContext, {
      associatedJudge: CHIEF_JUDGE,
      status: CASE_STATUS_TYPES.NEW,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseInventoryReport,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: CHIEF_JUDGE,
      status: CASE_STATUS_TYPES.NEW,
    });
    expect(result).toEqual([
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: 'A Test Caption',
        docketNumber: '123-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
        status: CASE_STATUS_TYPES.NEW,
      },
    ]);
  });
});
