import { hasAnotherCalendaredCaseAction } from './hasAnotherCalendaredCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('hasAnotherCalendaredCaseAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return path.no() if there are no calendared cases', async () => {
    await runAction(hasAnotherCalendaredCaseAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return path.no() if there are no calendared cases', async () => {
    await runAction(hasAnotherCalendaredCaseAction, {
      modules: {
        presenter,
      },
      props: { calendaredCases: [] },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return path.no() if there are on the last calendared cases', async () => {
    await runAction(hasAnotherCalendaredCaseAction, {
      modules: {
        presenter,
      },
      props: {
        calendaredCaseIndex: 0,
        calendaredCases: [{ docketNumber: 'abc' }],
        docketNumber: 'abc',
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return path.yes() if a trial session is calendared', async () => {
    await runAction(hasAnotherCalendaredCaseAction, {
      modules: {
        presenter,
      },
      props: {
        calendaredCases: [{ docketNumber: 'abc' }],
      },
    });

    expect(pathYesStub).toHaveBeenCalledWith({
      calendaredCaseIndex: 0,
      docketNumber: 'abc',
    });
  });
});
