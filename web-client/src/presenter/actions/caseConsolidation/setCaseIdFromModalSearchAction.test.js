import { runAction } from 'cerebral/test';
import { setCaseIdFromModalSearchAction } from './setCaseIdFromModalSearchAction';

describe('setCaseIdFromModalSearchAction', () => {
  it('matches a docket number', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with S suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18S',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with R suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18R',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with P suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18P',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with W suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18W',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with X suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18X',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with L suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18L',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('matches a docket number with SL suffix', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18SL',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
  it('does not match a docket number in invalid format', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '101-18SX',
        },
      },
    });
    expect(output.caseId).toEqual('101-18SX');
  });
  it('does not match a non-docket number', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: 'XY101-18',
        },
      },
    });
    expect(output.caseId).toEqual('XY101-18');
  });
  it('trims the search term', async () => {
    const { output } = await runAction(setCaseIdFromModalSearchAction, {
      state: {
        modal: {
          searchTerm: '  101-18SL  ',
        },
      },
    });
    expect(output.caseId).toEqual('101-18');
  });
});
