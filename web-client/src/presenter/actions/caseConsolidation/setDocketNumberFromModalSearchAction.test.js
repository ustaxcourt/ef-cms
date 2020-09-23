import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocketNumberFromModalSearchAction } from './setDocketNumberFromModalSearchAction';

describe('setDocketNumberFromModalSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('matches a docket number', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with R suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18R',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with P suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18P',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with W suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18W',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with X suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18X',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with L suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18L',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('matches a docket number with SL suffix', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18SL',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
  it('does not match a docket number in invalid format', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '101-18SX',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18SX');
  });
  it('does not match a non-docket number', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: 'XY101-18',
        },
      },
    });
    expect(output.docketNumber).toEqual('XY101-18');
  });
  it('trims the search term', async () => {
    const { output } = await runAction(setDocketNumberFromModalSearchAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          searchTerm: '  101-18SL  ',
        },
      },
    });
    expect(output.docketNumber).toEqual('101-18');
  });
});
