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

  it('routes to yes with the existing docketEntryId when pendingCoversheetDocketEntryIds includes it', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: {
        pendingCoversheetDocketEntryIds: ['abc'],
        docketEntryId: 'abc',
      },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({
      docketEntryId: 'abc',
      docketEntryIds: ['abc'],
    });
  });

  it('routes to yes and falls back to the first pending id for docketEntryId when props.docketEntryId is missing (websocket payload case)', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: { pendingCoversheetDocketEntryIds: ['xyz'] },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({
      docketEntryId: 'xyz',
      docketEntryIds: ['xyz'],
    });
  });

  it('forwards every pending id to the poll when multiple are enqueued', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: { pendingCoversheetDocketEntryIds: ['a', 'b', 'c'] },
      state: {},
    });

    expect(yesStub).toHaveBeenCalledWith({
      docketEntryId: 'a',
      docketEntryIds: ['a', 'b', 'c'],
    });
  });

  it('routes to no when pendingCoversheetDocketEntryIds is missing', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: {},
      state: {},
    });

    expect(noStub).toHaveBeenCalled();
  });

  it('routes to no when pendingCoversheetDocketEntryIds is an empty array', () => {
    runAction(isCoversheetNeededAction, {
      modules: { presenter },
      props: { pendingCoversheetDocketEntryIds: [] },
      state: {},
    });

    expect(noStub).toHaveBeenCalled();
  });
});
