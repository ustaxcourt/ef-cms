import { ROLES } from '@shared/business/entities/EntityConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { logUserPerformanceDataInteractor } from '@web-api/business/useCases/system/logUserPerformanceDataInteractor';

describe('logUserPerformanceDataInteractor', () => {
  const TEST_EMAIL = 'TEST_EMAIL@EXAMPLE.COM';

  const PERFORMANCE_DATA: {
    actionPerformanceArray: { actionName: string; duration: number }[];
    duration: number;
    email: string;
    sequenceName: string;
  } = {
    actionPerformanceArray: [
      { actionName: 'TEST_ACTION_NAME_1', duration: 25 },
      { actionName: 'TEST_ACTION_NAME_2', duration: 25 },
      { actionName: 'TEST_ACTION_NAME_3', duration: 25 },
      { actionName: 'TEST_ACTION_NAME_4', duration: 25 },
    ],
    duration: 100,
    email: TEST_EMAIL,
    sequenceName: 'TEST_SEQUENCE_NAME',
  };

  const TEST_USER: UnknownAuthUser = {
    email: TEST_EMAIL,
    name: 'TEST_NAME',
    role: ROLES.docketClerk,
    userId: 'SOME_TEST_USER_ID',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .saveSystemPerformanceData.mockImplementation(() => {});
  });

  it('should not allow unauthorized call to log data', async () => {
    await expect(
      logUserPerformanceDataInteractor(
        applicationContext,
        PERFORMANCE_DATA,
        undefined,
      ),
    ).rejects.toThrow('Unauthorized to log performance data');
  });

  it('should call persistence method with correct data', async () => {
    await logUserPerformanceDataInteractor(
      applicationContext,
      PERFORMANCE_DATA,
      TEST_USER,
    );

    const saveSystemPerformanceDataCalls =
      applicationContext.getPersistenceGateway().saveSystemPerformanceData.mock
        .calls;

    expect(saveSystemPerformanceDataCalls.length).toEqual(1);
    expect(saveSystemPerformanceDataCalls[0][0].performanceData).toEqual(
      PERFORMANCE_DATA,
    );
  });
});
