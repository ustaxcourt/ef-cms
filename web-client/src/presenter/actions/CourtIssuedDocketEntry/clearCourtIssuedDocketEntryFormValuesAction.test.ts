import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearCourtIssuedDocketEntryFormValuesAction } from './clearCourtIssuedDocketEntryFormValuesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearCourtIssuedDocketEntryFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should clear nonstandard form values if props.key is eventCode AND eventCode scenario does not include freetext', async () => {
    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OAL',
        },
        state: {
          form: {
            date: '12/12/2012',
            docketNumbers: '123-19',
            freeText: 'something',
            judge: 'Judge Colvin',
            trialLocation: 'Boise, Idaho',
          },
        },
      },
    );

    expect(result.state.form).toEqual({});
  });

  it('should clear ALL nonstandard form values except freetext if props.key is eventCode AND eventCode scenario does include freetext', async () => {
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
            date: '12/12/2012',
            docketNumbers: '123-19',
            freeText: 'something',
            judge: 'Judge Colvin',
            trialLocation: 'Boise, Idaho',
          },
        },
      },
    );

    expect(result.state.form).toEqual({
      freeText: 'something',
    });
  });

  it('should clear ALL nonstandard form values INCLUDING freetext if props.key is eventCode AND freeText is "Order"', async () => {
    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OCS',
        },
        state: {
          form: {
            date: '12/12/2012',
            freeText: 'Order',
            trialLocation: 'Boise, Idaho',
          },
        },
      },
    );

    expect(result.state.form).toEqual({});
  });

  it('should clear ALL nonstandard form values INCLUDING freetext if props.key is eventCode AND freeText is "Notice"', async () => {
    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OCS',
        },
        state: {
          form: {
            date: '12/12/2012',
            freeText: 'Notice',
            trialLocation: 'Boise, Idaho',
          },
        },
      },
    );

    expect(result.state.form).toEqual({});
  });

  it('should not clear any form values if props.key is not eventCode', async () => {
    const currentForm = {
      date: '12/12/2012',
      docketNumbers: '123-19',
      freeText: 'something',
      judge: 'Judge Colvin',
      trialLocation: 'Boise, Idaho',
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
