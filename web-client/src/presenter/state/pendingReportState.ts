import { PendingItem } from '@web-api/business/useCases/pendingItems/fetchPendingItemsInteractor';

export type PendingReports = {
  pendingItemsTotal: number;
  hasPendingItemsResults: boolean;
  pendingItems: PendingItem[];
  pendingItemsPage: number;
  selectedJudge: string;
};

export const initialPendingReportsState: PendingReports = {
  hasPendingItemsResults: false,
  pendingItems: [],
  pendingItemsPage: 0,
  pendingItemsTotal: 0,
  selectedJudge: '',
};
