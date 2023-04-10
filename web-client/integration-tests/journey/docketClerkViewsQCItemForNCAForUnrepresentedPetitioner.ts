import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkViewsQCItemForNCAForUnrepresentedPetitioner =
  cerebralTest => {
    return it('Docket clerk views QC item for NCA for unrepresented petitioner', async () => {
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

      expect(noticeOfChangeOfAddressQCItem).toMatchObject({
        docketEntry: {
          documentType: 'Notice of Change of Address',
        },
      });
    });
  };
