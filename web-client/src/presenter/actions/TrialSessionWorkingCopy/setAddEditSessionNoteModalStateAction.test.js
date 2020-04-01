import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAddEditSessionNoteModalStateAction } from './setAddEditSessionNoteModalStateAction';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

describe('setAddEditSessionNoteModalStateAction', () => {
  it('should set the modal caseId state', async () => {
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
  });
});
