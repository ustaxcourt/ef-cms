import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

presenter.providers.applicationContext = applicationContext;

const test = CerebralTest(presenter);

describe('setDocumentDetailTabSequence', () => {
  it('updates the document detail tab based on props', async () => {
    test.setState('documentDetail', {
      tab: 'docketRecord',
    });

    await test.runSequence('setDocumentDetailTabSequence', {
      tab: 'caseInfo',
    });
    expect(test.getState('documentDetail')).toMatchObject({
      tab: 'caseInfo',
    });
  });
});
