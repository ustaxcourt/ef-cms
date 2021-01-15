import { runAction } from 'cerebral/test';
import { setComputeFormMonthFactoryAction } from './setComputeFormMonthFactoryAction';

describe('setComputeFormMonthFactoryAction', () => {
  it('sets the props.computedDate value on the given form[path]', async () => {
    const result = await runAction(
      setComputeFormMonthFactoryAction('secondaryDocumentDate.month'),
      {
        props: {},
        state: {
          form: {
            secondaryDocumentDate: {
              month: '11',
            },
          },
        },
      },
    );

    expect(result.state.form.month).toEqual('11');
  });
});
