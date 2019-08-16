import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDeleteModalStateAction } from './setDeleteModalStateAction';

describe('setDeleteModalStateAction', () => {
  it('should set the modal caseId state', async () => {
    const result = await runAction(setDeleteModalStateAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '123' },
      state: {},
    });
    expect(result.state.modal.docketNumber).toEqual('123');
  });
});
