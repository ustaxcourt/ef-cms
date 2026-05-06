import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { state } from '@web-client/presenter/app.cerebral';

// The coversheet job is enqueued by the backend interactor that filed/served
// the docket entry; this action only observes completion so the UI can show
// the post-coversheet page count without a manual refresh.
export const awaitCoversheetCompleteAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { docketEntryId } = props;

  await pollForCoversheetComplete({
    applicationContext,
    docketEntryIds: [docketEntryId],
    docketNumber,
  });
};
