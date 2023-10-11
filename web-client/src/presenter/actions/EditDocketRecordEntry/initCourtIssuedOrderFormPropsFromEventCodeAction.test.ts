import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { initCourtIssuedOrderFormPropsFromEventCodeAction } from './initCourtIssuedOrderFormPropsFromEventCodeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;
applicationContext.getConstants.mockReturnValue({
  COURT_ISSUED_EVENT_CODES: [
    {
      code: 'Simba',
      documentTitle: 'Lion',
      documentType: 'Lion',
      eventCode: 'ROAR',
      scenario: 'type a',
    },
    {
      code: 'Shenzi',
      documentTitle: 'Hyena',
      documentType: 'Hyena',
      eventCode: 'HAHA',
      scenario: 'type a',
    },
    {
      code: 'Shenzi',
      documentTitle: 'Hyena',
      documentType: 'Hyena',
      eventCode: 'O',
      scenario: 'type a',
    },
  ],
});

describe('initCourtIssuedOrderFormPropsFromEventCodeAction', () => {
  it('should set the state when there is a matching event code', async () => {
    const result = await runAction(
      initCourtIssuedOrderFormPropsFromEventCodeAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            eventCode: 'ROAR',
          },
        },
      },
    );
    expect(result.state.form).toEqual({
      documentTitle: 'Lion',
      documentType: 'Lion',
      eventCode: 'ROAR',
      scenario: 'type a',
    });
  });

  it('should not update the state if there is no matching event code', async () => {
    const result = await runAction(
      initCourtIssuedOrderFormPropsFromEventCodeAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: {
            eventCode: 'MEOW',
          },
        },
      },
    );
    expect(result.state.form).toEqual({ eventCode: 'MEOW' });
  });
});
