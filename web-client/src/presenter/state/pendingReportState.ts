import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';

export type PendingReports = {
  pendingItemsTotal: number;
  hasPendingItemsResults: boolean;
  pendingItems: PendingItemFormatted[];
  selectedJudge: string;
};

export const initialPendingReportsState: PendingReports = {
  hasPendingItemsResults: false,
  pendingItems: [],
  pendingItemsTotal: 0,
  selectedJudge: '',
};
