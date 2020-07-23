import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAddEditCaseNoteModalStateFromDetailAction } from './setAddEditCaseNoteModalStateFromDetailAction';

describe('setAddEditCaseNoteModalStateFromDetailAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

  it('should set the modal state from caseDetail', async () => {
    const result = await runAction(
      setAddEditCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseNote: 'i got some notes',
            docketNumber: '101-19',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
          },
        },
      },
    );

    expect(result.state.modal.caseTitle).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19L');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });

  it('should set the modal state when caseCaption and docketNumberSuffix do not exist', async () => {
    const result = await runAction(
      setAddEditCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseNote: 'i got some notes',
            docketNumber: '101-19',
          },
        },
      },
    );

    expect(result.state.modal.caseTitle).toEqual('');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
