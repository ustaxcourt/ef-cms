import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isChambersPathAction } from './isChambersPathAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isChambersPathAction', () => {
  const pathNoStub = jest.fn();
  const pathYesStub = jest.fn();
  const { CHAMBERS_SECTION } = applicationContext.getConstants();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    no: pathNoStub,
    yes: pathYesStub,
  };

  it('should call path.no when props.value is NOT chambers section', async () => {
    await runAction(isChambersPathAction, {
      modules: {
        presenter,
      },
      props: {
        value: 'NOT_CHAMBERS_SECTION',
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should call path.yes when props.value is chambers section', async () => {
    await runAction(isChambersPathAction, {
      modules: {
        presenter,
      },
      props: {
        value: CHAMBERS_SECTION,
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
