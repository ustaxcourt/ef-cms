import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCaseModalSearchAction } from './setCaseModalSearchAction';

describe('setCaseModalSearchAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(setCaseModalSearchAction, {
      modules: {
        presenter,
      },
      props: { caseDetail: { docketNumber: '123-45' } },
      state: { modal: { confirmSelection: true, error: 'asasdasd' } },
    });

    expect(result.state.modal.caseDetail).toEqual({
      docketNumber: '123-45',
    });
    expect(result.state.modal.error).toBeUndefined();
    expect(result.state.modal.confirmSelection).toBeUndefined();
  });
});
