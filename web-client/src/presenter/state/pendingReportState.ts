import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';

export type PendingReports = {
  pendingItemsTotal: number;
  hasPendingItemsResults: boolean;
  pendingItems: PendingItem[];
  selectedJudge: string;
};

export const initialPendingReportsState: PendingReports = {
  hasPendingItemsResults: false,
  pendingItems: [],
  pendingItemsTotal: 0,
  selectedJudge: '',
};
