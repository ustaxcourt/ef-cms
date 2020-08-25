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
        props: { docketNumber: '101-19' },
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

    expect(result.state.modal).toMatchObject({
      caseTitle: 'Sisqo',
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19L',
      notes: 'i got some notes',
    });
  });

  it('should set the modal state when caseCaption and docketNumberSuffix do not exist', async () => {
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
            judgesNote: { notes: 'i got some notes' },
          },
        },
      },
    );
    expect(result.state.modal).toMatchObject({
      caseTitle: '',
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19',
      notes: 'i got some notes',
    });
  });
});
