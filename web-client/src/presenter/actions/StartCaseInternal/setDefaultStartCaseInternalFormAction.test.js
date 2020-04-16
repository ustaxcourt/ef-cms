import { Case } from '../../../../../shared/src/business/entities/cases/Case';
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

    expect(result.state.form.procedureType).toEqual(Case.PROCEDURE_TYPES[0]);
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
});
