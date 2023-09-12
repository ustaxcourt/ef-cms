import { CASE_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { editStatisticFormHelper as editStatisticFormHelperComputed } from './editStatisticFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const editStatisticFormHelper = withAppContextDecorator(
  editStatisticFormHelperComputed,
  applicationContext,
);

describe('editStatisticFormHelper', () => {
  it('sets headerDateDisplay to state.form.year if present', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {},
        form: {
          year: '2012',
        },
      },
    });
    expect(result.headerDateDisplay).toEqual('2012');
  });

  it('sets headerDateDisplay to formatted state.form.lastDateOfPeriod if year is not present', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {},
        form: {
          lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
        },
      },
    });
    expect(result.headerDateDisplay).toEqual('03/01/19');
  });

  it('sets showDelete true if the case type is not deficiency', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.cdp,
        },
        form: {},
      },
    });
    expect(result.showDelete).toEqual(true);
  });

  it('sets showDelete true if the case type is deficiency and hasVerifiedIrsNotice is false', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: false,
        },
        form: {},
      },
    });
    expect(result.showDelete).toEqual(true);
  });

  it('sets showDelete true if the case type is deficiency and hasVerifiedIrsNotice is true and statistics length is greater than 1', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: [{ irsTotalPenalties: 1 }, { irsTotalPenalties: 2 }],
        },
        form: {},
      },
    });
    expect(result.showDelete).toEqual(true);
  });

  it('sets showDelete false if the case type is deficiency and hasVerifiedIrsNotice is true and statistics length is 1', () => {
    const result = runCompute(editStatisticFormHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: [{ irsTotalPenalties: 1 }],
        },
        form: {},
      },
    });
    expect(result.showDelete).toEqual(false);
  });
});
