import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupGrantDenyMotionRedirectUrlAction } from './setupGrantDenyMotionRedirectUrlAction';

describe('setupGrantDenyMotionRedirectUrlAction', () => {
  it('sets redirectUrl to the message detail when parentMessageId is present', async () => {
    const result = await runAction(setupGrantDenyMotionRedirectUrlAction, {
      modules: { presenter },
      props: { parentMessageId: 'abc-message-id' },
      state: {
        caseDetail: { docketNumber: '101-26' },
      },
    });

    expect(result.state.redirectUrl).toEqual(
      '/messages/101-26/message-detail/abc-message-id',
    );
  });

  it('reads parentMessageId from state when not passed in props', async () => {
    const result = await runAction(setupGrantDenyMotionRedirectUrlAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '102-26' },
        parentMessageId: 'state-message-id',
      },
    });

    expect(result.state.redirectUrl).toEqual(
      '/messages/102-26/message-detail/state-message-id',
    );
  });

  it('does not set redirectUrl when parentMessageId is absent', async () => {
    const result = await runAction(setupGrantDenyMotionRedirectUrlAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
      },
    });

    expect(result.state.redirectUrl).toBeUndefined();
  });

  it('does not overwrite an existing redirectUrl', async () => {
    const result = await runAction(setupGrantDenyMotionRedirectUrlAction, {
      modules: { presenter },
      props: { parentMessageId: 'abc-message-id' },
      state: {
        caseDetail: { docketNumber: '101-26' },
        redirectUrl: '/existing-redirect',
      },
    });

    expect(result.state.redirectUrl).toEqual('/existing-redirect');
  });
});
