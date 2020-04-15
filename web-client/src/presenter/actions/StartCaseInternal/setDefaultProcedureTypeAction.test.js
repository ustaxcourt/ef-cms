import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultProcedureTypeAction } from './setDefaultProcedureTypeAction';

describe('setDefaultProcedureTypeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form.procedureType to the default', async () => {
    const result = await runAction(setDefaultProcedureTypeAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form.procedureType).toEqual(Case.PROCEDURE_TYPES[0]);
  });

  it('does not override procedureType if it is already present on the form', async () => {
    const result = await runAction(setDefaultProcedureTypeAction, {
      modules: {
        presenter,
      },
      state: { form: { procedureType: 'A procedure type' } },
    });

    expect(result.state.form.procedureType).toEqual('A procedure type');
  });
});
