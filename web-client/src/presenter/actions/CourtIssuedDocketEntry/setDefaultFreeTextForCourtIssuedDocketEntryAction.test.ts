import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultFreeTextForCourtIssuedDocketEntryAction } from './setDefaultFreeTextForCourtIssuedDocketEntryAction';

describe('setDefaultFreeTextForCourtIssuedDocketEntryAction', () => {
  it('should default state.form.freeText to Order if props.key is eventCode and props.value is O', async () => {
    const result = await runAction(
      setDefaultFreeTextForCourtIssuedDocketEntryAction,
      {
        props: {
          key: 'eventCode',
          value: 'O',
        },
        state: {
          form: {},
        },
      },
    );

    expect(result.state.form).toEqual({
      freeText: 'Order',
    });
  });

  it('should default state.form.freeText to Notice if props.key is eventCode and props.value is NOT', async () => {
    const result = await runAction(
      setDefaultFreeTextForCourtIssuedDocketEntryAction,
      {
        props: {
          key: 'eventCode',
          value: 'NOT',
        },
        state: {
          form: {},
        },
      },
    );

    expect(result.state.form).toEqual({
      freeText: 'Notice',
    });
  });

  it('should not change state.form.freeText if props.key is not eventCode', async () => {
    const result = await runAction(
      setDefaultFreeTextForCourtIssuedDocketEntryAction,
      {
        props: {
          key: 'documentType',
          value: 'NOT',
        },
        state: {
          form: {
            freeText: 'Be Free',
          },
        },
      },
    );

    expect(result.state.form).toEqual({
      freeText: 'Be Free',
    });
  });

  it('should not change state.form.freeText if props.key is eventCode and props.value is not O or NOT', async () => {
    const result = await runAction(
      setDefaultFreeTextForCourtIssuedDocketEntryAction,
      {
        props: {
          key: 'eventCode',
          value: 'ABC',
        },
        state: {
          form: {
            freeText: 'Be Free',
          },
        },
      },
    );

    expect(result.state.form).toEqual({
      freeText: 'Be Free',
    });
  });
});
