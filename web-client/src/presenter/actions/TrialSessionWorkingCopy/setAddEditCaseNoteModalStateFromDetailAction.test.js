import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditCaseNoteModalStateFromDetailAction } from './setAddEditCaseNoteModalStateFromDetailAction';

presenter.providers.applicationContext = applicationContext;

describe('setAddEditCaseNoteModalStateFromDetailAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(
      setAddEditCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            caseNote: { notes: 'i got some notes' },
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
