import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditCaseNoteModalStateFromListAction } from './setAddEditCaseNoteModalStateFromListAction';

presenter.providers.applicationContext = applicationContext;

describe('setAddEditCaseNoteModalStateFromListAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(setAddEditCaseNoteModalStateFromListAction, {
      modules: {
        presenter,
      },
      props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
      state: {
        trialSession: {
          calendaredCases: [
            {
              caseCaption: 'Sisqo, Petitioner',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            },
          ],
        },
        trialSessionWorkingCopy: {
          caseNotes: {
            'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              notes: 'i got some notes',
            },
          },
        },
      },
    });
    expect(result.state.modal.caseCaptionNames).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
