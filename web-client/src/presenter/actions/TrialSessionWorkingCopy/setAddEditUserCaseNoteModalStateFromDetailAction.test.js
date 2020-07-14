import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAddEditUserCaseNoteModalStateFromDetailAction } from './setAddEditUserCaseNoteModalStateFromDetailAction';

describe('setAddEditUserCaseNoteModalStateFromDetailAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();

  it('should set the modal state from caseDetail and props', async () => {
    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            docketNumber: '101-19',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
            judgesNote: { notes: 'i got some notes' },
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
      setAddEditUserCaseNoteModalStateFromDetailAction,
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

    expect(result.state.modal.caseTitle).toEqual('');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
