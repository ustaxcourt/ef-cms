import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setCaseModalSearchAction } from './setCaseModalSearchAction';

describe('setCaseModalSearchAction', () => {
  it('should set the state from props', async () => {
    const result = await runAction(setCaseModalSearchAction, {
      modules: {
        presenter,
      },
      props: { caseDetail: { caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb' } },
      state: { modal: { confirmSelection: true, error: 'asasdasd' } },
    });
    expect(result.state.modal.caseDetail).toEqual({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result.state.modal.error).toBeUndefined();
    expect(result.state.modal.confirmSelection).toBeUndefined();
  });
});
