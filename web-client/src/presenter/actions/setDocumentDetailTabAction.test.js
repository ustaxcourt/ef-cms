import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDocumentDetailTabAction } from './setDocumentDetailTabAction';

presenter.providers.applicationContext = applicationContext;

describe('setDocumentDetailTabAction', () => {
  it('sets the document detail tab', async () => {
    const result = await runAction(setDocumentDetailTabAction, {
      props: {
        tab: 'caseInfo',
      },
      state: {
        path: 'docketClerk',
      },
    });
    expect(result.state.documentDetail.tab).toEqual('caseInfo');
  });
});
