import { runAction } from 'cerebral/test';
import { setDocketNumberFromSearchAction } from './setDocketNumberFromSearchAction';

describe('setDocketNumberFromSearchAction', () => {
  it('matches a docket number', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with R suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18R',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with P suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18P',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with W suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18W',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with X suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18X',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with L suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18L',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with SL suffix', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18SL',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
  it('does not match a docket number in invalid format', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '101-18SX',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18SX');
  });
  it('does not match a non-docket number', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: 'XY101-18',
        },
      },
    });
    expect(state.docketNumber).toEqual('XY101-18');
  });
  it('trims the search term', async () => {
    const { state } = await runAction(setDocketNumberFromSearchAction, {
      state: {
        header: {
          searchTerm: '  101-18SL  ',
        },
      },
    });
    expect(state.docketNumber).toEqual('101-18');
  });
});
