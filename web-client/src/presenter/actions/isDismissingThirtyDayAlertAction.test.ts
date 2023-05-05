import { isDismissingThirtyDayAlertAction } from './isDismissingThirtyDayAlertAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isDismissingThirtyDayAlertAction', () => {
  let pathNoStub;
  let pathYesStub;

  beforeEach(() => {
    pathNoStub = jest.fn();
    pathYesStub = jest.fn();

    presenter.providers = {
      path: {
        no: pathNoStub,
        yes: pathYesStub,
      },
    };
  });

  it('should call path.yes when props.isDismissingThirtyDayAlert is true', async () => {
    await runAction(isDismissingThirtyDayAlertAction, {
      modules: {
        presenter,
      },
      props: { isDismissingThirtyDayAlert: true },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should call path.no when props.isDismissingThirtyDayAlert is false', async () => {
    await runAction(isDismissingThirtyDayAlertAction, {
      modules: {
        presenter,
      },
      state: { isDismissingThirtyDayAlert: false },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
