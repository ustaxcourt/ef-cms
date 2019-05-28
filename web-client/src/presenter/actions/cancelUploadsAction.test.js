import { cancelUploadsAction } from './cancelUploadsAction';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('cancelUploadsAction', () => {
  it('should change the window.location', async () => {
    const replaceStub = sinon.stub().returns('');

    global.window = {
      location: {
        replace: replaceStub,
      },
    };

    await runAction(cancelUploadsAction);

    expect(replaceStub.calledOnce).toEqual(true);

    sinon.restore();
  });
});
