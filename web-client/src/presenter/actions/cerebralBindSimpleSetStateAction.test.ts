import { cerebralBindSimpleSetStateAction } from './cerebralBindSimpleSetStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('cerebralBindSimpleSetStateAction', () => {
  it('sets state.props.key to props.value', async () => {
    const { state } = await runAction(cerebralBindSimpleSetStateAction, {
      props: {
        key: 'tabName',
        value: 'caseDetail',
      },
    });

    expect(state.tabName).toEqual('caseDetail');
  });
});
