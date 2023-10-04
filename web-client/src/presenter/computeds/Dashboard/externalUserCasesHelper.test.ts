import { applicationContext } from '../../../applicationContext';
import { externalUserCasesHelper as externalUserCasesHelperComputed } from './externalUserCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

const externalUserCasesHelper = withAppContextDecorator(
  externalUserCasesHelperComputed,
  {
    ...applicationContext,
    getUtilities: () => ({
      formatCase: () => ({
        docketNumber: '123-20',
      }),
    }),
  },
);

const baseState = {
  closedCases: [...Array(10).keys()],
  constants: {
    CASE_LIST_PAGE_SIZE: 5,
  },
  openCases: [...Array(10).keys()],
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
        closedCases: [0],
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
        openCases: [0],
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: true,
      showLoadMoreOpenCases: false,
    });
  });

  it('sets the total count of both open and closed cases based on when the user is directly associated with the case', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        closedCases: [{ docketNumber: '101-20' }],
        openCases: [
          {
            conslidatedCases: [
              {
                docketNumber: '108-20',
                isRequestingUserAssociated: true,
                leadDocketNumber: '102-20',
              },
              {
                docketNumber: '109-20',
                isRequestingUserAssociated: true,
                leadDocketNumber: '102-20',
              },
            ],
            docketNumber: '102-20',
            isRequestingUserAssociated: false,
            leadDocketNumber: '102-20',
          },
          { docketNumber: '103-20', isRequestingUserAssociated: true },
        ],
      },
    });

    expect(result).toMatchObject({
      closedCasesCount: 1,
      openCasesCount: 3,
    });
  });

  it('uses current pages in state', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        closedCasesCurrentPage: 2,
        openCasesCurrentPage: 2,
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: false,
      showLoadMoreOpenCases: false,
    });
  });
});
