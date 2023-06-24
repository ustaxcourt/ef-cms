import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormDateAction } from './setFormDateAction';

describe('setFormDateAction', () => {
  const MOCK_DATE = '2019-03-01T21:40:46.415Z';

  it('sets state.form.date to props.computedDate when props.computedDate is defined', async () => {
    const result = await runAction(setFormDateAction, {
      props: {
        computedDate: MOCK_DATE,
      },
      state: { form: {} },
    });

    expect(result.state.form).toEqual({
      date: MOCK_DATE,
    });
  });

  it('unsets state.form.date when props.computedDate is undefined', async () => {
    const result = await runAction(setFormDateAction, {
      props: {},
      state: { form: { date: MOCK_DATE } },
    });

    expect(result.state.form).toEqual({
      date: undefined,
    });
  });
});
