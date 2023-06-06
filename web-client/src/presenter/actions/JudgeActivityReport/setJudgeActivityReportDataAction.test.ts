import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setJudgeActivityReportDataAction } from './setJudgeActivityReportDataAction';

describe('setJudgeActivityReportDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set props.casesClosedByJudge on state', async () => {
    const mockCasesClosedByJudge = {
      [CASE_STATUS_TYPES.closed]: 1,
      [CASE_STATUS_TYPES.closedDismissed]: 3,
    };

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        casesClosedByJudge: mockCasesClosedByJudge,
      },
      state: {
        judgeActivityReportData: {
          casesClosedByJudge: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.casesClosedByJudge).toBe(
      mockCasesClosedByJudge,
    );
  });

  it('should set props.trialSessions on state', async () => {
    const mockTrialSessions = {
      [SESSION_TYPES.hybrid]: 0.5,
      [SESSION_TYPES.regular]: 1.5,
      [SESSION_TYPES.motionHearing]: 2,
    };

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        trialSessions: mockTrialSessions,
      },
      state: {
        judgeActivityReportData: {
          trialSessions: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.trialSessions).toBe(mockTrialSessions);
  });

  it('should set props.opinions on state', async () => {
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

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        opinions: mockOpinions,
      },
      state: {
        judgeActivityReportData: {
          opinions: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.opinions).toBe(mockOpinions);
  });

  it('should set props.orders on state', async () => {
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

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        orders: mockOrdersIssuedByJudge,
      },
      state: {
        judgeActivityReportData: {
          orders: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.orders).toBe(mockOrdersIssuedByJudge);
  });

  it('should set props.submittedAndCavCasesByJudge on state', async () => {
    const mockSubmittedAndCavCasesByJudge = [
      {
        docketNumber: '101-22',
        leadDocketNumber: '101-22',
        status: 'Submitted',
      },
      { docketNumber: '111-11', status: 'Submitted' },
      { docketNumber: '134-21', status: 'CAV' },
    ];

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        submittedAndCavCasesByJudge: mockSubmittedAndCavCasesByJudge,
      },
      state: {
        judgeActivityReportData: {
          submittedAndCavCasesByJudge: undefined,
        },
      },
    });

    expect(state.judgeActivityReportData.submittedAndCavCasesByJudge).toBe(
      mockSubmittedAndCavCasesByJudge,
    );
  });

  it('should set props.submittedAndCavCasesByJudge on state', async () => {
    const mockConsolidatedCasesGroupCountMap = new Map([['101-22', 5]]);

    const { state } = await runAction(setJudgeActivityReportDataAction as any, {
      modules: {
        presenter,
      },
      props: {
        consolidatedCasesGroupCountMap: mockConsolidatedCasesGroupCountMap,
      },
      state: {
        judgeActivityReportData: {
          consolidatedCasesGroupCountMap: undefined,
        },
      },
    });

    expect(
      Object.fromEntries(
        state.judgeActivityReportData.consolidatedCasesGroupCountMap,
      ),
    ).toMatchObject(Object.fromEntries(mockConsolidatedCasesGroupCountMap));
  });
});
