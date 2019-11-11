import { sortedUniq } from 'lodash';
import { state } from 'cerebral';

export const formattedPendingItems = (get, applicationContext) => {
  // const { formatCase } = applicationContext.getUtilities();

  const pendingItems = get(state.pendingItems);
  const judges = sortedUniq(pendingItems.map(i => i.associatedJudge).sort());

  const result = {
    items: pendingItems, // formatCase(applicationContext, pendingItems),
    judges,
  };

  return result;
};
