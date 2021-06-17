import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService =
  test => {
    return it('Docket Clerk does not view QC item for NCA for case with no paper service', async () => {
      const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

      test.setState('caseDetail', {});
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
      expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

      const caseWithNoPaperService = test.getState('caseDetail');

      const contactPrimary = contactPrimaryFromState(test);

      expect(contactPrimary.serviceIndicator).not.toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(
        caseWithNoPaperService.privatePractitioners[0].serviceIndicator,
      ).not.toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);

      await test.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      });
      const workQueueFormatted = runCompute(formattedWorkQueue, {
        state: test.getState(),
      });

      const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === test.docketNumber,
      );

      expect(noticeOfChangeOfAddressQCItem).toBeUndefined();
    });
  };
