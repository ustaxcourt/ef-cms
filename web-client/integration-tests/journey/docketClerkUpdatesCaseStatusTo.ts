import { runCompute } from 'cerebral/test';
import { updateCaseModalHelper as updateCaseModalHelperComputed } from '../../src/presenter/computeds/updateCaseModalHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkUpdatesCaseStatusTo = (
  cerebralTest,
  caseStatusToUpdateTo,
) => {
  return it(`Docket clerk updates case status to ${caseStatusToUpdateTo}`, async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const currentStatus = cerebralTest.getState('caseDetail.status');

    await cerebralTest.runSequence('openUpdateCaseModalSequence');

    const updateCaseModalHelper = runCompute(
      withAppContextDecorator(updateCaseModalHelperComputed),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(updateCaseModalHelper.caseStatusOptions).toContain(
      caseStatusToUpdateTo,
    );
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(cerebralTest.getState('modal.caseStatus')).toEqual(currentStatus);

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: caseStatusToUpdateTo,
    });

    await cerebralTest.runSequence('submitUpdateCaseModalSequence');

    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      caseStatusToUpdateTo,
    );
    expect(cerebralTest.getState('modal')).toEqual({});
  });
};
