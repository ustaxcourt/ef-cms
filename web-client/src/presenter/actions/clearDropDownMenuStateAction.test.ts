import { clearDropDownMenuStateAction } from './clearDropDownMenuStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDropDownMenuStateAction', () => {
  it('unsets the given props.menuState', async () => {
    const result = await Promise.resolve(
      runAction(clearDropDownMenuStateAction, {
        props: {
          menuState: 'someKey',
        },
        state: {
          someKey: 'someValue',
        },
      }),
    );
    expect(result.state).not.toHaveProperty('someKey');
  });
});
