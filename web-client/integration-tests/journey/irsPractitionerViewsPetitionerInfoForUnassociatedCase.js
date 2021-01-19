import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from '../../src/presenter/computeds/caseDetailSubnavHelper';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

const caseDetailSubnavHelper = withAppContextDecorator(
  caseDetailSubnavHelperComputed,
);

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const irsPractitionerViewsPetitionerInfoForUnassociatedCase = (
  testObj,
  isSealed = false,
) => {
  const sealedLabel = isSealed ? 'sealed' : 'unsealed';
  // IRS practitioner views petitioner info for unassociated unsealed case
  // IRS practitioner views petitioner info for unassociated sealed case
  return it(`IRS practitioner views petitioner info for unassociated ${sealedLabel} case`, async () => {
    await testObj.runSequence('gotoCaseDetailSequence', {
      docketNumber: testObj.docketNumber,
    });

    expect(testObj.getState('currentPage')).toEqual('CaseDetail');

    const helper = runCompute(caseDetailSubnavHelper, {
      state: testObj.getState(),
    });

    const caseDetail = runCompute(formattedCaseDetail, {
      state: testObj.getState(),
    });

    const caseDetailHelperResult = runCompute(caseDetailHelper, {
      state: testObj.getState(),
    });

    expect(testObj.getState().screenMetadata.isAssociatd).toBeFalsy();

    if (isSealed) {
      expect(caseDetailHelperResult.userCanViewCase).toEqual(false);
    } else {
      expect(caseDetailHelperResult.userCanViewCase).toEqual(true);
      expect(helper.showCaseInformationTab).toBeTruthy();
      expect(caseDetail.contactPrimary.serviceIndicator).toEqual('Electronic');
    }
  });
};
