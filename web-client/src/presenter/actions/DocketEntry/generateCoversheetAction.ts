import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Enqueues a coversheet generation job for the docket entry set on state
 * and awaits completion so callers see the same wait behavior as before.
 */
export const generateCoversheetAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const { docketEntryId } = props;

  await applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  await pollForCoversheetComplete({
    applicationContext,
    docketEntryIds: [docketEntryId],
    docketNumber,
  });
};
