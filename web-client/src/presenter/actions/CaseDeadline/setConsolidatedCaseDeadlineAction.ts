import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setConsolidatedCaseDeadlineAction = ({
  props,
  store,
}: ActionProps<{
  consolidatedCaseDeadlines: { docketNumber: string; caseCaption: string }[];
}>) => {
  const { consolidatedCaseDeadlines } = props;
  store.set(
    state[STATE_KEYS.CONSOLIDATED_CASE_DEADLINES],
    consolidatedCaseDeadlines,
  );
};
