import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditNoteModalStateAction } from './setAddEditNoteModalStateAction';

describe('setAddEditNoteModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(setAddEditNoteModalStateAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '123-12' },
      state: {
        trialSessionWorkingCopy: {
          caseMetadata: {
            '123-12': { notes: 'i got some notes' },
          },
        },
      },
    });
    expect(result.state.modal.docketNumber).toEqual('123-12');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
