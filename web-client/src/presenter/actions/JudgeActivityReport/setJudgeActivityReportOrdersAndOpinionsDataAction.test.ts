import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeActivityReportOrdersAndOpinionsDataAction } from './setJudgeActivityReportOrdersAndOpinionsDataAction.ts';

describe('setJudgeActivityReportOrdersAndOpinionsDataAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const mockOrdersIssuedByJudge = [
    {
      count: 1,
      documentType: 'Order',
      eventCode: 'O',
    },
    {
      count: 5,
      documentType: 'Order for Dismissal',
      eventCode: 'ODS',
    },
  ];

  const mockOpinions = [
    {
      count: 1,
      documentType: 'Memorandum Opinion',
      eventCode: 'MOP',
    },
    {
      count: 0,
      documentType: 'S Opinion',
      eventCode: 'SOP',
    },
    {
      count: 0,
      documentType: 'TC Opinion',
      eventCode: 'TCOP',
    },
    {
      count: 4,
      documentType: 'Bench Opinion',
      eventCode: 'OST',
    },
  ];

  it('should set props.opinions on state.judgeActivityReport.judgeActivityReportData.opinions', async () => {
    const { state } = await runAction(
      setJudgeActivityReportOrdersAndOpinionsDataAction,
      {
        modules: {
          presenter,
        },
        props: {
          opinions: mockOpinions,
          orders: undefined,
        },
        state: {
          judgeActivityReport: {
            judgeActivityReportData: {
              opinions: undefined,
              orders: mockOrdersIssuedByJudge,
            },
          },
        },
      },
    );

    expect(state.judgeActivityReport.judgeActivityReportData.opinions).toBe(
      mockOpinions,
    );
    expect(state.judgeActivityReport.judgeActivityReportData.orders).toBe(
      mockOrdersIssuedByJudge,
    );
  });

  it('should set props.orders on state.judgeActivityReport.judgeActivityReportData.orders', async () => {
    const { state } = await runAction(
      setJudgeActivityReportOrdersAndOpinionsDataAction as any,
      {
        modules: {
          presenter,
        },
        props: {
          opinions: undefined,
          orders: mockOrdersIssuedByJudge,
        },
        state: {
          judgeActivityReport: {
            judgeActivityReportData: {
              opinions: mockOpinions,
              orders: undefined,
            },
          },
        },
      },
    );

    expect(state.judgeActivityReport.judgeActivityReportData.orders).toBe(
      mockOrdersIssuedByJudge,
    );

    expect(state.judgeActivityReport.judgeActivityReportData.opinions).toBe(
      mockOpinions,
    );
  });
});
