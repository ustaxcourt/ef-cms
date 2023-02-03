import { clearDropDownMenuStateAction } from './clearDropDownMenuStateAction';
import { runAction } from 'cerebral/test';

describe('clearDropDownMenuStateAction', () => {
  it('unsets the given props.menuState', async () => {
    const result = await runAction(clearDropDownMenuStateAction, {
      props: {
        menuState: 'someKey',
      },
      state: {
        someKey: 'someValue',
      },
    });
    expect(result.state.someKey).toBeUndefined();
  });
});
