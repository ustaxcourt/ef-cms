import { DEFAULT_PROCEDURE_TYPE } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultStartCaseInternalFormAction } from './setDefaultStartCaseInternalFormAction';

describe('setDefaultStartCaseInternalFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form.procedureType to the default', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form.procedureType).toEqual(DEFAULT_PROCEDURE_TYPE);
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

  it('sets state.form.hasVerifiedIrsNotice to false by default', async () => {
    const result = await runAction(setDefaultStartCaseInternalFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form.hasVerifiedIrsNotice).toEqual(false);
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
