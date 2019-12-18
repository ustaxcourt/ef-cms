import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';

import {
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
} from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest();

describe('a docket clerk uploads a pending item and sees that it is pending', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => {
        return new Promise(resolve => {
          resolve(new Uint8Array(fakeFile));
        });
      },
    };
  });

  let docketNumber = null;
  let caseDetail;
  let pendingItemsCount;

  it('login as a petitioner and create a case', async () => {
    await loginAs(test, 'petitioner');
    caseDetail = await uploadPetition(test);
    ({ docketNumber } = caseDetail.docketNumber);
  });

  it('login as a docket clerk and check pending items count', async () => {
    await loginAs(test, 'docketclerk');
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    await test.runSequence('gotoPendingReportSequence');
    pendingItemsCount = (test.getState('pendingItems') || []).length;

    expect(formatted.pendingItemsDocketEntries.length).toEqual(0);
  });

  it('respondent uploads a proposed stipulated decision', async () => {
    await loginAs(test, 'respondent');
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    await uploadProposedStipulatedDecision(test);
  });

  it('login as a docket clerk and check pending items count has increased', async () => {
    await loginAs(test, 'docketclerk');
    await viewCaseDetail({
      docketNumber: caseDetail.docketNumber,
      test,
    });
    const formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.pendingItemsDocketEntries.length).toEqual(1);

    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoPendingReportSequence');
    const currentPendingItemsCount = (test.getState('pendingItems') || [])
      .length;

    expect(currentPendingItemsCount).toBeGreaterThan(pendingItemsCount);
  });
});
