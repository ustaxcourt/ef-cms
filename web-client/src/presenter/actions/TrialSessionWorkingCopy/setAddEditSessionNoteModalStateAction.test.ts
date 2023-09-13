import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditSessionNoteModalStateAction } from './setAddEditSessionNoteModalStateAction';

describe('setAddEditSessionNoteModalStateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  let user;
  const { USER_ROLES } = applicationContext.getConstants();
  applicationContext.getCurrentUser = () => user;

  it('should set the modal state', async () => {
    user = { role: USER_ROLES.judge };
    const result = await runAction(setAddEditSessionNoteModalStateAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          startDate: '2001-12-12T01:30:00.000Z',
          trialLocation: "Bob's Burgers",
        },
        trialSessionWorkingCopy: {
          sessionNotes: 'i got some notes',
        },
      },
    });

    expect(result.state.modal.notes).toEqual('i got some notes');
    expect(result.state.modal.notesLabel).toEqual('Judge’s notes');
  });

  it('should set the notes label to `User notes` if the user is a trialClerk', async () => {
    user = { role: USER_ROLES.trialClerk };

    const result = await runAction(setAddEditSessionNoteModalStateAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          startDate: '2001-12-12T01:30:00.000Z',
          trialLocation: "Bob's Burgers",
        },
        trialSessionWorkingCopy: {
          sessionNotes: 'i got some notes',
        },
      },
    });

    expect(result.state.modal.notesLabel).toEqual('User notes');
  });
});
