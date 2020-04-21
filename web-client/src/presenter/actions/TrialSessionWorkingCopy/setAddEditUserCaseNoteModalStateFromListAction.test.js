import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAddEditUserCaseNoteModalStateFromListAction } from './setAddEditUserCaseNoteModalStateFromListAction';

describe('setAddEditUserCaseNoteModalStateFromListAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set the modal caseId state', async () => {
    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromListAction,
      {
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
            userNotes: {
              'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
                caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                notes: 'i got some notes',
              },
            },
          },
        },
      },
    );

    expect(result.state.modal.caseTitle).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.notes).toEqual('i got some notes');
  });

  it('defaults caseTitle to empty string if the case is not on state.trialSession.calendaredCases', async () => {
    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromListAction,
      {
        modules: {
          presenter,
        },
        props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
        state: {
          trialSession: {
            calendaredCases: [],
          },
          trialSessionWorkingCopy: {
            userNotes: {
              'c54ba5a9-b37b-479d-9201-067ec6e335bb': {
                caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                notes: 'i got some notes',
              },
            },
          },
        },
      },
    );

    expect(result.state.modal.caseTitle).toEqual('');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
