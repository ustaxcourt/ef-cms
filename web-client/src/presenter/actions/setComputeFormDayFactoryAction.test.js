import { runAction } from 'cerebral/test';
import { setComputeFormDayFactoryAction } from './setComputeFormDayFactoryAction';

describe('setComputeFormDayFactoryAction', () => {
  it('sets the props.computedDate value on the given form[path]', async () => {
    const result = await runAction(
      setComputeFormDayFactoryAction('secondaryDocumentDate.day'),
      {
        props: {},
        state: {
          form: {
            secondaryDocumentDate: {
              day: '23',
            },
          },
        },
      },
    );

    expect(result.state.form.day).toEqual('23');
  });
});
