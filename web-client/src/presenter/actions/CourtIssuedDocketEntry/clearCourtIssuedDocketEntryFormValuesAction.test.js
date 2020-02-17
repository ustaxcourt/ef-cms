import { clearCourtIssuedDocketEntryFormValuesAction } from './clearCourtIssuedDocketEntryFormValuesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('clearCourtIssuedDocketEntryFormValuesAction', () => {
  it('should clear nonstandard form values if props.key is eventCode', async () => {
    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'O',
        },
        state: {
          form: {
            day: '12',
            docketNumbers: '123-19',
            freeText: 'something',
            judge: 'Judge Armen',
            month: '12',
            year: '2012',
          },
        },
      },
    );

    expect(result.state.form).toEqual({});
  });

  it('should not clear any form values if props.key is not eventCode', async () => {
    const currentForm = {
      day: '12',
      docketNumbers: '123-19',
      freeText: 'something',
      judge: 'Judge Armen',
      month: '12',
      year: '2012',
    };

    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'freeText',
          value: '123',
        },
        state: {
          form: currentForm,
        },
      },
    );

    expect(result.state.form).toEqual(currentForm);
  });
});
