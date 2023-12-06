import { chooseByTruthyStateActionFactory } from './chooseByTruthyStateActionFactory';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('chooseByTruthyStateActionFactory', () => {
  let noStub;
  let yesStub;

  beforeAll(() => {
    noStub = jest.fn();
    yesStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('chooses the yes path if value path is truthy', async () => {
    await runAction(chooseByTruthyStateActionFactory('something.or.another'), {
      modules: {
        presenter,
      },
      state: {
        something: {
          or: {
            another: true,
          },
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('chooses the no path if value path is falsy', async () => {
    await runAction(chooseByTruthyStateActionFactory('something.or.another'), {
      modules: {
        presenter,
      },
      state: {
        something: {
          or: {
            another: false,
          },
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('chooses the no path if value path is not found', async () => {
    await runAction(chooseByTruthyStateActionFactory('something.or.another'), {
      modules: {
        presenter,
      },
      state: {
        something: {
          and: {
            another: true,
          },
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
