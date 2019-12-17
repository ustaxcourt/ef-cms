import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDeleteProceduralNoteModalStateAction } from './setDeleteProceduralNoteModalStateAction';

presenter.providers.applicationContext = applicationContext;

describe('setDeleteProceduralNoteModalStateAction', () => {
  it('should set the modal state caseId from caseDetail', async () => {
    const result = await runAction(setDeleteProceduralNoteModalStateAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
    });
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
  });
});
