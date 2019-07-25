import { clearForwardFormAction } from './clearForwardFormAction';
import { runAction } from 'cerebral/test';

describe('clearForwardFormAction', () => {
  it('should clear form for given workItemId and workItemMetadata', async () => {
    const workItemId = 'work-item-id';

    const result = await runAction(clearForwardFormAction, {
      props: {
        workItemId,
      },
      state: {
        form: {
          [workItemId]: {
            foo: 'bar',
          },
        },
        workItemMetadata: {
          foo: 'bar',
        },
      },
    });

    expect(result.state.form[workItemId]).toMatchObject({});
    expect(result.state.workItemMetadata).toMatchObject({});
  });
});
