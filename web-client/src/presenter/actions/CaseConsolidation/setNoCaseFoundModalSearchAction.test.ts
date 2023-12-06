import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setNoCaseFoundModalSearchAction } from './setNoCaseFoundModalSearchAction';

describe('setNoCaseFoundModalSearchAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(setNoCaseFoundModalSearchAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: '123-45' },
      state: {},
    });
    expect(result.state.modal.error).toEqual('No Case Found');
    expect(result.state.modal.caseDetail).toBeUndefined();
  });
});
