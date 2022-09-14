import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { clearCourtIssuedDocketEntryFormValuesAction } from './clearCourtIssuedDocketEntryFormValuesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearCourtIssuedDocketEntryFormValuesAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should clear nonstandard form values if props.key is eventCode AND eventCode scenario does not include freetext', async () => {
    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        applicationContext,
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OAL',
        },
        state: {
          form: {
            day: '12',
            docketNumbers: '123-19',
            freeText: 'something',
            judge: 'Judge Colvin',
            month: '12',
            trialLocation: 'Boise, Idaho',
            year: '2012',
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
        applicationContext,
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
            judge: 'Judge Colvin',
            month: '12',
            trialLocation: 'Boise, Idaho',
            year: '2012',
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
        applicationContext,
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OCS',
        },
        state: {
          form: {
            day: '12',
            freeText: 'Order',
            month: '12',
            trialLocation: 'Boise, Idaho',
            year: '2012',
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
        applicationContext,
        modules: {
          presenter,
        },
        props: {
          key: 'eventCode',
          value: 'OCS',
        },
        state: {
          form: {
            day: '12',
            freeText: 'Notice',
            month: '12',
            trialLocation: 'Boise, Idaho',
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
      judge: 'Judge Colvin',
      month: '12',
      trialLocation: 'Boise, Idaho',
      year: '2012',
    };

    const result = await runAction(
      clearCourtIssuedDocketEntryFormValuesAction,
      {
        applicationContext,
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
