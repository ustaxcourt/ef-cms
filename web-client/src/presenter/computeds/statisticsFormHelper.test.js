import { CASE_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from './statisticsFormHelper';
import { withAppContextDecorator } from '../../withAppContext';

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
  applicationContext,
);

describe('case detail edit computed', () => {
  it('sets showStatisticsForm true if case type is deficiency and hasVerifiedIrsNotice is true', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
        },
      },
    });
    expect(result.showStatisticsForm).toBeTruthy();
  });

  it('sets showStatisticsForm false if case type is deficiency and hasVerifiedIrsNotice is false', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: false,
        },
      },
    });
    expect(result.showStatisticsForm).toBeFalsy();
  });

  it('sets showStatisticsForm false if case type is not deficiency and hasVerifiedIrsNotice is true', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {
          caseType: CASE_TYPES_MAP.cdp,
          hasVerifiedIrsNotice: true,
        },
      },
    });
    expect(result.showStatisticsForm).toBeFalsy();
  });

  it('sets showAddMoreStatisticsButton false if statistics is not present on the form', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {},
      },
    });
    expect(result.showAddMoreStatisticsButton).toBeFalsy();
  });

  it('sets showAddMoreStatisticsButton false if statistics array length is greater than 12', () => {
    const manyStatistics = [];
    for (let i = 0; i < 12; i++) {
      manyStatistics.push({ yearOrPeriod: 'Period' });
    }
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: { statistics: manyStatistics },
      },
    });
    expect(result.showAddMoreStatisticsButton).toBeFalsy();
  });

  it('sets showAddMoreStatisticsButton true if statistics array length is less than 12', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: { statistics: [{ yearOrPeriod: 'Year' }] },
      },
    });
    expect(result.showAddMoreStatisticsButton).toBeTruthy();
  });

  it('sets statisticOptions to empty array is statistics is not present on the form', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {},
      },
    });
    expect(result.statisticOptions).toEqual([]);
  });

  it('sets statisticOptions showYearInput and showPeriodInput for all statistics in form based on yearOrPeriod value', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {
          statistics: [{ yearOrPeriod: 'Year' }, { yearOrPeriod: 'Period' }],
        },
      },
    });
    expect(result.statisticOptions).toEqual([
      { showYearInput: true },
      { showPeriodInput: true },
    ]);
  });

  it('sets showAddAnotherPenaltyButton true if state.modal.penalties length is less than 10', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {},
        modal: {
          penalties: [''],
        },
      },
    });
    expect(result.showAddAnotherPenaltyButton).toBeTruthy();
  });

  it('sets showAddAnotherPenaltyButton false if state.modal.penalties length is 10', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {},
        modal: {
          penalties: new Array(10).fill(''),
        },
      },
    });
    expect(result.showAddAnotherPenaltyButton).toBeFalsy();
  });

  it('sets showAddAnotherPenaltyButton false if state.modal.penalties is undefined', () => {
    const result = runCompute(statisticsFormHelper, {
      state: {
        form: {},
        modal: {},
      },
    });
    expect(result.showAddAnotherPenaltyButton).toBeFalsy();
  });
});
