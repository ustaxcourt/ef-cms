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

  it('routes to yes with the existing docketEntryId when coversheetPendingForDocketEntryId is set alongside it', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: {
        coversheetPendingForDocketEntryId: 'abc',
        docketEntryId: 'abc',
      },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({ docketEntryId: 'abc' });
  });

  it('routes to yes and falls back to coversheetPendingForDocketEntryId for the docketEntryId when props.docketEntryId is missing (websocket payload case)', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: { coversheetPendingForDocketEntryId: 'xyz' },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({ docketEntryId: 'xyz' });
  });

  it('routes to no when coversheetPendingForDocketEntryId is not set', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: {},
      state: {},
    });

    expect(noStub).toHaveBeenCalled();
  });
});
