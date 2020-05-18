import { Case } from '../../../../shared/src/business/entities/cases/Case';
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
          caseType: Case.CASE_TYPES_MAP.deficiency,
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
          caseType: Case.CASE_TYPES_MAP.deficiency,
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
          caseType: Case.CASE_TYPES_MAP.cdp,
          hasVerifiedIrsNotice: true,
        },
      },
    });
    expect(result.showStatisticsForm).toBeFalsy();
  });
});
