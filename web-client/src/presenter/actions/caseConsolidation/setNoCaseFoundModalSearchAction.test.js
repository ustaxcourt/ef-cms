import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setNoCaseFoundModalSearchAction } from './setNoCaseFoundModalSearchAction';

describe('setNoCaseFoundModalSearchAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(setNoCaseFoundModalSearchAction, {
      modules: {
        presenter,
      },
      props: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' },
      state: {},
    });
    expect(result.state.modal.error).toEqual('No Case Found');
    expect(result.state.modal.caseDetail).toBeUndefined();
  });
});
