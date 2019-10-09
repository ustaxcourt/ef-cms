import { runAction } from 'cerebral/test';
import { setFieldOrderAction } from './setFieldOrderAction';

describe('setFieldOrderAction', () => {
  it('adds the props.field key to state.fieldOrder', async () => {
    const result = await runAction(setFieldOrderAction, {
      props: {
        field: 'name',
      },
      state: {
        fieldOrder: [],
      },
    });
    expect(result.state.fieldOrder).toEqual(['name']);
  });
});
