import { externalUserCasesHelper as externalUserCasesHelperComputed } from './externalUserCasesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

const externalUserCasesHelper = withAppContextDecorator(
  externalUserCasesHelperComputed,
  {
    getCurrentUser: () => ({
      userId: '123',
    }),
  },
);

const baseState = {
  constants: {
    CASE_LIST_PAGE_SIZE: 5,
  },
  formattedClosedCases: [...Array(10).keys()],
  formattedOpenCases: [...Array(10).keys()],
};

describe('externalUserCasesHelper', () => {
  it('returns more than 10 open and closed cases, shows load more button for both', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: true,
      showLoadMoreOpenCases: true,
    });
  });

  it("doesn't show load more button for closed cases", () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        formattedClosedCases: [0],
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: false,
      showLoadMoreOpenCases: true,
    });
  });

  it("doesn't show load more button for open cases", () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        formattedOpenCases: [0],
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: true,
      showLoadMoreOpenCases: false,
    });
  });
});
