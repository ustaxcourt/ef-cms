import { applicationContext } from '../../../applicationContext';
import { getPdfFileAction } from './getPdfFileAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getPdfFileAction', () => {
  // TODO: skipped until cerebral bug is fixed: https://github.com/cerebral/cerebral/pull/1431
  it.skip('throws error if htmlString is empty', async () => {
    await expect(
      runAction(getPdfFileAction, {
        props: { htmlString: '' },
        state: {},
      }),
    ).rejects.toThrow();
  });
});
