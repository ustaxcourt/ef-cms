import { runAction } from 'cerebral/test';

import sinon from 'sinon';

import applicationContext from '../../applicationContext';
import presenter from '..';
import navigateToErrorAction from './navigateToErrorAction';

presenter.providers.applicationContext = applicationContext;
const errorRouteSpy = sinon.spy();
presenter.providers.router = {
  route: errorRouteSpy,
};

describe('navigateToErrorAction', async () => {
  it('calls router.route to the error page', async () => {
    await runAction(navigateToErrorAction, presenter);
    expect(errorRouteSpy.called).toEqual(true);
    expect(errorRouteSpy.getCall(0).args[0]).toEqual('/error');
  });
});
