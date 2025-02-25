import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const fetchPendingItemsAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  pendingItems: PendingItem[];
}> => {
  const judge = get(state.pendingReports.selectedJudge);

  const { foundDocuments } = await applicationContext
    .getUseCases()
    .fetchPendingItemsInteractor(applicationContext, {
      judge,
    });

  return { pendingItems: foundDocuments };
};
