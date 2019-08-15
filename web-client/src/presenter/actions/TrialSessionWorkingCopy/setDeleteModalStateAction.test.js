import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDeleteModalStateAction } from './setDeleteModalStateAction';

describe('setDeleteModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(setDeleteModalStateAction, {
      modules: {
        presenter,
      },
      props: { caseId: '123' },
      state: {},
    });
    expect(result.state.modal.caseId).toEqual('123');
  });
});
