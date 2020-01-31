import { initCourtIssuedOrderFormPropsFromEventCodeAction } from './initCourtIssuedOrderFormPropsFromEventCodeAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('initCourtIssuedOrderFormPropsFromEventCodeAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getConstants: () => {
        return {
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
        };
      },
    };
  });

  it('should set the state when there is a matching event code', async () => {
    const result = await runAction(
      initCourtIssuedOrderFormPropsFromEventCodeAction,
      {
        modules: {
          presenter,
        },
        props: { initEventCode: 'ROAR' },
        state: { form: {} },
      },
    );
    expect(result.state.form).toEqual({
      documentTitle: 'Lion',
      documentType: 'Lion',
      eventCode: 'ROAR',
      scenario: 'type a',
    });
  });

  it('should not set the state if there is not a matching event code', async () => {
    const result = await runAction(
      initCourtIssuedOrderFormPropsFromEventCodeAction,
      {
        modules: {
          presenter,
        },
        props: { initEventCode: 'MEOW' },
        state: { form: {} },
      },
    );
    expect(result.state.form).toEqual({});
  });
});
