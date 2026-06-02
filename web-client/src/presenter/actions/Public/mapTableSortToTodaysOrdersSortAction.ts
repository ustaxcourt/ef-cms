import { state } from '@web-client/presenter/app-public.cerebral';

const SORT_FIELD_MAP: Record<string, Record<string, string>> = {
  docketNumber: {
    asc: 'DOCKET_NUMBER_ASC',
    desc: 'DOCKET_NUMBER_DESC',
  },
  documentTitle: {
    asc: 'DOCUMENT_TITLE_ASC',
    desc: 'DOCUMENT_TITLE_DESC',
  },
  filingDate: {
    asc: 'FILING_DATE_ASC',
    desc: 'FILING_DATE_DESC',
  },
  numberOfPages: {
    asc: 'NUMBER_OF_PAGES_ASC',
    desc: 'NUMBER_OF_PAGES_DESC',
  },
};

export const mapTableSortToTodaysOrdersSortAction = ({
  props,
  store,
}: ActionProps<{ sortField: string; sortOrder: 'asc' | 'desc' }>) => {
  const { sortField, sortOrder } = props;

  const mappedSort = SORT_FIELD_MAP[sortField]?.[sortOrder];
  if (mappedSort) {
    store.set(state.sessionMetadata.todaysOrdersSort, mappedSort);
  }

  store.set(state.todaysOrders.page, 1);
  store.set(state.todaysOrdersCurrentPaginationPage, 0);
};
