import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';
import { shouldAllowMultiDocketing } from '@shared/business/utilities/shouldAllowMultiDocketing';

export const isDocketEntryMultiDocketableAction = ({
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  let docketEntry = get(state.form);

  if (!docketEntry.eventCode) {
    docketEntry = caseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );
  }

  const isLead = isLeadCase(caseDetail);

  if (
    shouldAllowMultiDocketing({
      docketEntry,
      isLead,
    })
  ) {
    return path.yes();
  }

  return path.no();
};
