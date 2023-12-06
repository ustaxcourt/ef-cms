import { haveNOTTsBeenServedAction } from './haveNOTTsBeenServedAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('haveNOTTsBeenServedAction', () => {
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

  it('should return `yes` when thirty day notice of trial documents have already been served for the trial session', () => {
    runAction(haveNOTTsBeenServedAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          hasNOTTBeenServed: true,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return `no` when thirty day notice of trial documents have NOT been served for the trial session', () => {
    runAction(haveNOTTsBeenServedAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          hasNOTTBeenServed: false,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
