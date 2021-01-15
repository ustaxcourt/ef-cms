import { runAction } from 'cerebral/test';
import { setComputeFormYearFactoryAction } from './setComputeFormYearFactoryAction';

describe('setComputeFormYearFactoryAction', () => {
  it('sets the props.computedDate value on the given form[path]', async () => {
    const result = await runAction(
      setComputeFormYearFactoryAction('secondaryDocumentDate.year'),
      {
        props: {},
        state: {
          form: {
            secondaryDocumentDate: {
              year: '2021',
            },
          },
        },
      },
    );

    expect(result.state.form.year).toEqual('2021');
  });
});
