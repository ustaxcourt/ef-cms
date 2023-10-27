import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { formatDateString } from '../../../shared/src/business/utilities/DateHandler';

export const checkWorkitemOnCalendaredCase = (
  cerebralTest,
  trialDate,
  trialLocation,
) => {
  return it('should have a trial date and trial location on workItem associated with a calendared case', () => {
    const workQueue = cerebralTest.getState('workQueue');
    const calendaredWorkItem = workQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId,
    );

    const expectedTrialDate = formatDateString(
      `${trialDate.year}-${trialDate.month}-${trialDate.day}`,
    );

    expect(calendaredWorkItem.caseStatus).toBe(CASE_STATUS_TYPES.calendared);
    expect(calendaredWorkItem.trialDate).toEqual(expectedTrialDate);
    expect(calendaredWorkItem.trialLocation).toEqual(trialLocation);
  });
};
