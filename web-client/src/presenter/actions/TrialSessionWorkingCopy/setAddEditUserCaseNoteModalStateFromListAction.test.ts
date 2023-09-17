import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditUserCaseNoteModalStateFromListAction } from './setAddEditUserCaseNoteModalStateFromListAction';

describe('setAddEditUserCaseNoteModalStateFromListAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set the modal docketNumber state', async () => {
    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromListAction,
      {
        modules: {
          presenter,
        },
        props: { docketNumber: MOCK_CASE.docketNumber },
        state: {
          trialSession: {
            calendaredCases: [
              {
                caseCaption: 'Sisqo, Petitioner',
                docketNumber: MOCK_CASE.docketNumber,
              },
            ],
          },
          trialSessionWorkingCopy: {
            userNotes: {
              '101-18': {
                docketNumber: MOCK_CASE.docketNumber,
                notes: 'i got some notes',
              },
            },
          },
        },
      },
    );

    expect(result.state.modal.caseTitle).toEqual('Sisqo');
    expect(result.state.modal.docketNumber).toEqual(MOCK_CASE.docketNumber);
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
