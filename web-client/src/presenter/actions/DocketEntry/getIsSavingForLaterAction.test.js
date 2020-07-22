import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getIsSavingForLaterAction } from './getIsSavingForLaterAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getIsSavingForLaterAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns the yes path if saving for later', async () => {
    await runAction(getIsSavingForLaterAction, {
      modules: {
        presenter,
      },
      props: {
        isSavingForLater: true,
      },
    });

    expect(yesStub).toBeCalled();
  });

  it('returns the no path if NOT saving for later (i.e. saving and serving)', async () => {
    await runAction(getIsSavingForLaterAction, {
      modules: {
        presenter,
      },
    });

    expect(noStub).toBeCalled();
  });
});
