import { isCoversheetNeededAction } from './isCoversheetNeededAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isCoversheetNeededAction', () => {
  const noStub = jest.fn();
  const yesStub = jest.fn();

  presenter.providers.path = {
    no: noStub,
    yes: yesStub,
  };

  it('should return yes path when props.generateCoversheet is true', () => {
    runAction(isCoversheetNeededAction, {
      modules: {
        presenter,
      },
      props: {
        generateCoversheet: true,
      },
      state: {},
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should return no path when props.generateCoversheet is false', () => {
    runAction(isCoversheetNeededAction, {
      modules: {
        presenter,
      },
      props: {
        generateCoversheet: false,
      },
      state: {},
    });

    expect(noStub).toHaveBeenCalled();
  });
});
