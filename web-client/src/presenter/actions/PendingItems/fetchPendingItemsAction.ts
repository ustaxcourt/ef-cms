import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const fetchPendingItemsAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  pendingItems: PendingItem[];
  total: number;
}> => {
  const judge = get(state.pendingReports.selectedJudge);

  const page = get(state.pendingReports.pendingItemsPage);

  const { foundDocuments, total } = await applicationContext
    .getUseCases()
    .fetchPendingItemsInteractor(applicationContext, {
      judge,
      page,
    });

  return { pendingItems: foundDocuments, total };
};
