import { DEFAULT_PROCEDURE_TYPE } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultStartCaseInternalFormAction } from './setDefaultStartCaseInternalFormAction';

describe('setDefaultStartCaseInternalFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set default fields', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form.procedureType).toEqual(DEFAULT_PROCEDURE_TYPE);
    expect(result.state.form.hasVerifiedIrsNotice).toEqual(false);
    expect(result.state.form.isPaper).toEqual(true);
  });

  it('does not override procedureType if it is already present on the form', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: { procedureType: 'A procedure type' } },
    });

    expect(result.state.form.procedureType).toEqual('A procedure type');
  });

  it('does not override hasVerifiedIrsNotice if it is already present on the form', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: { hasVerifiedIrsNotice: true } },
    });

    expect(result.state.form.hasVerifiedIrsNotice).toEqual(true);
  });

  it('sets state.form.statistics to an array with a default value for yearOrPeriod', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form.statistics).toEqual([]);
  });

  it('does not override statistics if it is already present on the form', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: { statistics: [{ yearOrPeriod: 'Year' }] } },
    });

    expect(result.state.form.statistics).toEqual([{ yearOrPeriod: 'Year' }]);
  });
});
