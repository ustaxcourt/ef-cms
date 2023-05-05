import { isDismissingThirtyDayAlertAction } from './isDismissingThirtyDayAlertAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isDismissingThirtyDayAlertAction', () => {
  let pathNoStub;
  let pathYesStub;

  beforeEach(() => {
    pathNoStub = jest.fn();
    pathYesStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should call path.yes when props.dismissedAlertForNOTT is true', async () => {
    await runAction(isDismissingThirtyDayAlertAction, {
      modules: {
        presenter,
      },
      props: { dismissedAlertForNOTT: true },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should call path.no when props.dismissedAlertForNOTT is false', async () => {
    await runAction(isDismissingThirtyDayAlertAction, {
      modules: {
        presenter,
      },
      state: { dismissedAlertForNOTT: false },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
