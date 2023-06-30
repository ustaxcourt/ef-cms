import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultEditDocumentEntryPointAction } from './setDefaultEditDocumentEntryPointAction';

describe('setDefaultEditDocumentEntryPointAction', () => {
  it('sets state.editDocumentEntryPoint to CaseDetail', async () => {
    const { state } = await runAction(setDefaultEditDocumentEntryPointAction, {
      state: {},
    });

    expect(state.editDocumentEntryPoint).toEqual('CaseDetail');
  });
});
