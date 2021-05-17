import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPetitionersPendingEmailStatusOnCaseAction } from './setPetitionersPendingEmailStatusOnCaseAction';

describe('setPetitionersPendingEmailStatusOnCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.screenMetadata.pendingEmails from props.pendingEmails', async () => {
    const mockPendingEmailObj = {
      '1cb8bd71-a37e-42d7-b5e5-c6fc3c178178': true,
    };

    const { state } = await runAction(
      setPetitionersPendingEmailStatusOnCaseAction,
      {
        props: {
          pendingEmails: [mockPendingEmailObj],
        },
      },
    );

    expect(state.screenMetadata.pendingEmails).toEqual([mockPendingEmailObj]);
  });

  it('should set state.screenMetadata.pendingEmails to undefined when props.pendingEmails is undefined', async () => {
    const { state } = await runAction(
      setPetitionersPendingEmailStatusOnCaseAction,
      {
        props: {
          pendingEmails: undefined,
        },
      },
    );

    expect(state.screenMetadata.pendingEmails).toBeUndefined();
  });
});
