import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsSectionDocumentQCInboxCount = (
  cerebralTest,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets Section Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: cerebralTest.getState(),
    });
    if (cerebralTest.petitionsClerkSectionDocumentQCInboxCount !== undefined) {
      expect(helper.sectionInboxCount).toEqual(
        cerebralTest.petitionsClerkSectionDocumentQCInboxCount +
          adjustExpectedCountBy,
      );
    } else {
      expect(helper.sectionInboxCount).toBeGreaterThan(0);
    }
  });
};
