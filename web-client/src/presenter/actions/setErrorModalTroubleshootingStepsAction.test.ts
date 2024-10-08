import { runAction } from '@web-client/presenter/test.cerebral';
import { setErrorModalTroubleshootingStepsAction } from './setErrorModalTroubleshootingStepsAction';

describe('setErrorModalTroubleshootingStepsAction', () => {
  it('sets the troubleshooting steps correctly', async () => {
    const { state } = await runAction(setErrorModalTroubleshootingStepsAction, {
      props: {
        contactSupportMessage: 'testContactSupportMessage',
        troubleshootingInfo: {
          linkMessage: 'testMessage',
          linkUrl: 'testLink',
        },
      },
    });

    expect(state.modal.contactSupportMessage).toEqual(
      'testContactSupportMessage',
    );
    expect(state.modal.troubleshootingInfo).toEqual({
      linkMessage: 'testMessage',
      linkUrl: 'testLink',
    });
  });
});
