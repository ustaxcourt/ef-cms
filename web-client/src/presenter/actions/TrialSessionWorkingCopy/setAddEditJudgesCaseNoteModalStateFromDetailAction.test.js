import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditJudgesCaseNoteModalStateFromDetailAction } from './setAddEditJudgesCaseNoteModalStateFromDetailAction';

presenter.providers.applicationContext = applicationContext;

describe('setAddEditJudgesCaseNoteModalStateFromDetailAction', () => {
  it('should set the modal state from caseDetail and props', async () => {
    const result = await runAction(
      setAddEditJudgesCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            docketNumber: '101-19',
            docketNumberSuffix: 'L',
            judgesNote: { notes: 'i got some notes' },
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19L');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });

  it('should set the modal state when caseCaption and docketNumberSuffix do not exist', async () => {
    const result = await runAction(
      setAddEditJudgesCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        state: {
          caseDetail: {
            docketNumber: '101-19',
            judgesNote: { notes: 'i got some notes' },
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
