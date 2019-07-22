import { applicationContext } from '../../../applicationContext';
import { getPdfFileAction } from './getPdfFileAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getPdfFileAction', () => {
  it('throws error if htmlString is empty', async () => {
    await expect(
      runAction(getPdfFileAction, {
        props: { htmlString: '' },
        state: {},
      }),
    ).rejects.toThrow();
  });
});
