import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultCaseProcedureAction } from '@web-client/presenter/actions/setDefaultCaseProcedureAction';

describe('setDefaultCaseProcedureAction', () => {
  it('should set the default case procedure type correctly', async () => {
    const result = await runAction(setDefaultCaseProcedureAction, {
      state: {
        form: undefined,
      },
    });

    expect(result.state.form).toEqual({
      procedureType: PROCEDURE_TYPES_MAP.regular,
    });
  });
});
