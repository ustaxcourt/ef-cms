import { runAction } from 'cerebral/test';
import { setPractitionerResultsAction } from './setPractitionerResultsAction';

describe('setPractitionerResultsAction', () => {
  it('should set state.searchResults to the passed in props.practitioners', async () => {
    const result = await runAction(setPractitionerResultsAction, {
      props: { practitioners: [{ barNumber: '1111' }] },
      state: {},
    });

    expect(result.state.searchResults).toEqual([{ barNumber: '1111' }]);
  });
});
