import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from '../../src/presenter/computeds/caseDetailSubnavHelper';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailSubnavHelper = withAppContextDecorator(
  caseDetailSubnavHelperComputed,
);

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const irsPractitionerViewsPetitionerInfoForUnassociatedCase = test => {
  return it('IRS practitioner views petitioner info for unassociated case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');

    const helper = runCompute(caseDetailSubnavHelper, {
      state: test.getState(),
    });

    const caseDetail = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(test.getState().screenMetadata.isAssociatd).toBeFalsy();
    expect(helper.showCaseInformationTab).toBeTruthy();
    expect(caseDetail.contactPrimary.serviceIndicator).toEqual('Electronic');
  });
};
