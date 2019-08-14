import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setCurrentPageAction } from './setCurrentPageAction';

presenter.providers.applicationContext = applicationContext;

describe('setCurrentPageAction', () => {
  it('sets the current page', async () => {
    const result = await runAction(setCurrentPageAction('testPage'), {
      props: {},
      state: {
        currentPage: '',
      },
    });

    expect(result.state.currentPage).toEqual('testPage');
  });

  it('returns a near-immediately resolving promise if options.force is set after setting the current page', async () => {
    const result = await runAction(
      setCurrentPageAction('testPage', { force: true }),
      {
        props: {},
        state: {
          currentPage: '',
        },
      },
    );

    expect(result.state.currentPage).toEqual('testPage');
  });
});
