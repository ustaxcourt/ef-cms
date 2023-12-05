import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setAddEditUserCaseNoteModalStateFromDetailAction } from './setAddEditUserCaseNoteModalStateFromDetailAction';

describe('setAddEditUserCaseNoteModalStateFromDetailAction', () => {
  presenter.providers.applicationContext = applicationContext;

  let user;
  const { USER_ROLES } = applicationContext.getConstants();
  applicationContext.getCurrentUser = () => user;

  it('should set the modal state from caseDetail and props', async () => {
    user = { role: USER_ROLES.judge };
    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { docketNumber: '101-19' },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19L',
          },
          judgesNote: { notes: 'i got some notes' },
        },
      },
    );

    expect(result.state.modal).toMatchObject({
      caseTitle: 'Sisqo',
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19L',
      notes: 'i got some notes',
      notesLabel: 'Judge’s notes',
    });
  });

  it('should set the modal state when caseCaption and docketNumberSuffix do not exist', async () => {
    user = { role: USER_ROLES.docketClerk };

    const result = await runAction(
      setAddEditUserCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        props: { docketNumber: '101-19' },
        state: {
          caseDetail: {
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19',
          },
          judgesNote: { notes: 'i got some notes' },
        },
      },
    );
    expect(result.state.modal).toMatchObject({
      caseTitle: '',
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19',
      notes: 'i got some notes',
      notesLabel: 'Judge’s notes',
    });
  });
});
