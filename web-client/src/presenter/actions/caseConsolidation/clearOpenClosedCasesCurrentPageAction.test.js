import { clearOpenClosedCasesCurrentPageAction } from './clearOpenClosedCasesCurrentPageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearOpenClosedCasesCurrentPageAction', () => {
  it('should unset the closedCasesCurrentPage value on the state', async () => {
    const { state } = await runAction(clearOpenClosedCasesCurrentPageAction, {
      modules: { presenter },
      state: {
        closedCasesCurrentPage: 123,
      },
    });

    expect(state.closedCasesCurrentPage).toBeUndefined();
  });

  it('should unset the openCasesCurrentPage value on the state', async () => {
    const { state } = await runAction(clearOpenClosedCasesCurrentPageAction, {
      modules: { presenter },
      state: {
        openCasesCurrentPage: 456,
      },
    });

    expect(state.openCasesCurrentPage).toBeUndefined();
  });
});
