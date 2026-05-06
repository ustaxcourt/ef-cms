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

  beforeEach(() => {
    noStub.mockReset();
    yesStub.mockReset();
  });

  it('should return yes path when props.generateCoversheet is true', () => {
    runAction(isCoversheetNeededAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: 'abc',
        generateCoversheet: true,
      },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({ docketEntryId: 'abc' });
  });

  it('should return yes path when props.coversheetPendingForDocketEntryId is set', () => {
    runAction(isCoversheetNeededAction, {
      modules: {
        presenter,
      },
      props: {
        coversheetPendingForDocketEntryId: 'xyz',
      },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({ docketEntryId: 'xyz' });
  });

  it('should return no path when neither flag is set', () => {
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
