import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const practitionerViewsCaseDetailWithPaperService = cerebralTest => {
  return it('Practitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formattedCase.isPaper).toEqual(true);
    expect(formattedCase.petitioners[0].serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
};
