import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDeleteCaseNoteModalStateAction } from './setDeleteCaseNoteModalStateAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setDeleteCaseNoteModalStateAction', () => {
  it('should set the modal state docketNumber from caseDetail', async () => {
    const result = await runAction(setDeleteCaseNoteModalStateAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });
    expect(result.state.modal.docketNumber).toEqual('123-45');
  });
});
