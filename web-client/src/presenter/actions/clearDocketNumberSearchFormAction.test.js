import { clearDocketNumberSearchFormAction } from './clearDocketNumberSearchFormAction';
import { runAction } from 'cerebral/test';

describe.only('clearDocketNumberSearchFormAction', () => {
  it('should clear the docket number search form and clear the state.searchResults', async () => {
    const result = await runAction(clearDocketNumberSearchFormAction, {
      state: {
        docketNumberSearchForm: { docketNumber: 123 - 45 },
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
      },
    });

    expect(result.state.docketNumberSearchForm).toEqual({});
    expect(result.state.searchResults).toBeUndefined();
  });
});
