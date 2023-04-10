import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService =
  cerebralTest => {
    return it('Docket Clerk does not view QC item for NCA for case with no paper service', async () => {
      const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

      cerebralTest.setState('caseDetail', {});
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });
      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseWithNoPaperService = cerebralTest.getState('caseDetail');

      const contactPrimary = contactPrimaryFromState(cerebralTest);

      expect(contactPrimary.serviceIndicator).not.toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(
        caseWithNoPaperService.privatePractitioners[0].serviceIndicator,
      ).not.toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);

      await cerebralTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      });
      const workQueueFormatted = runCompute(formattedWorkQueue, {
        state: cerebralTest.getState(),
      });

      const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === cerebralTest.docketNumber,
      );

      expect(noticeOfChangeOfAddressQCItem).toBeUndefined();
    });
  };
