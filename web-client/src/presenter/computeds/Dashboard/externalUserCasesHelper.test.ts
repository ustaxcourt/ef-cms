import { externalUserCasesHelper as externalUserCasesHelperComputed } from './externalUserCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

const externalUserCasesHelper = withAppContextDecorator(
  externalUserCasesHelperComputed,
);

describe('externalUserCasesHelper', () => {
  let baseState;
  beforeEach(() => {
    baseState = {
      closedCases: [
        { docketNumber: '101-20' },
        { docketNumber: '102-20' },
        { docketNumber: '103-20' },
        { docketNumber: '104-20' },
      ],
      constants: {
        CASE_LIST_PAGE_SIZE: 2,
      },
      openCases: [
        {
          consolidatedCases: [
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
        { docketNumber: '103-21', isRequestingUserAssociated: true },
        { docketNumber: '103-22' },
        { docketNumber: '103-23' },
      ],
    };
  });
  it('should display the load more button for both open and closed cases if there are more cases than page size', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: baseState,
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: true,
      showLoadMoreOpenCases: true,
    });
  });

  it("should not show 'Load More' button for closed cases", () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        closedCases: [{ docketNumber: '104-20' }],
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: false,
      showLoadMoreOpenCases: true,
    });
  });

  it("should not show 'Load More' button for open cases", () => {
    const result = runCompute(externalUserCasesHelper, {
      state: {
        ...baseState,
        openCases: [{ docketNumber: '103-23' }],
      },
    });

    expect(result).toMatchObject({
      showLoadMoreClosedCases: true,
      showLoadMoreOpenCases: false,
    });
  });

  it('sets the total count of both open and closed cases based on when the user is directly associated with the case', () => {
    const result = runCompute(externalUserCasesHelper, {
      state: baseState,
    });

    expect(result).toMatchObject({
      closedCasesCount: 4,
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
