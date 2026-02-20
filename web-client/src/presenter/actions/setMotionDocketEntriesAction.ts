import { state } from '@web-client/presenter/app.cerebral';

export const setMotionDocketEntriesAction = ({
  props,
  store,
}: ActionProps) => {
  const motionEntries = props.motionDocketEntries || [];
  const singleDocketEntry = props.docketEntry;

  // Merge the single docket entry being edited into the motions list so that
  // computeds like formattedDocument (which search caseDetail.docketEntries by
  // docketEntryId) can still find it.
  let docketEntries = [...motionEntries];
  if (
    singleDocketEntry &&
    !docketEntries.some(
      d => d.docketEntryId === singleDocketEntry.docketEntryId,
    )
  ) {
    docketEntries.push(singleDocketEntry);
  }

  store.set(state.caseDetail.docketEntries, docketEntries);
};
