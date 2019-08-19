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
        props: { docketNumber: '123-12' },
        state: {
          caseDetail: { caseCaption: 'Sisqo, Petitioner' },
          trialSessionWorkingCopy: {
            caseMetadata: {
              '123-12': { notes: 'i got some notes' },
            },
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('Sisqo');
    expect(result.state.modal.docketNumber).toEqual('123-12');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
