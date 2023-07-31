import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentDetailTabAction } from './setDocumentDetailTabAction';

describe('setDocumentDetailTabAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the document detail tab', async () => {
    const result = await runAction(setDocumentDetailTabAction, {
      props: {
        tab: 'caseInfo',
      },
      state: {
        path: 'docketClerk',
      },
    });
    expect(result.state.currentViewMetadata.documentDetail.tab).toEqual(
      'caseInfo',
    );
  });
});
