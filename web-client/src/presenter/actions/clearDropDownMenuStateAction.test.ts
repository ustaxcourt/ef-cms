import { clearDropDownMenuStateAction } from './clearDropDownMenuStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDropDownMenuStateAction', () => {
  it('unsets the given props.menuState', async () => {
    const result = await runAction(clearDropDownMenuStateAction, {
      props: {
        menuState: 'someKey',
      },
      state: {
        someKey: 'someValue',
      } as Record<string, unknown>,
    });
    expect(
      (result.state as unknown as Record<string, unknown>).someKey,
    ).toBeUndefined();
  });
});
