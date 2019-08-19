import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditSessionNoteModalStateAction } from './setAddEditSessionNoteModalStateAction';

presenter.providers.applicationContext = applicationContext;

describe('setAddEditSessionNoteModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(setAddEditSessionNoteModalStateAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          startDate: '12-12-2001',
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
