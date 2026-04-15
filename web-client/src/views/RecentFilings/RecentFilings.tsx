import React, { useRef, useMemo } from 'react';
import {
  FORMATS,
  formatDateString,
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { RecentFilingsNonMobile } from './RecentFilingsNonMobile';
import { RecentFilingsMobile } from './RecentFilingsMobile';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';
import { CaseStatusInfoModal } from '@web-client/views/RecentFilings/CaseStatusInfoModal';

type RecentFilingsProps = {
  recentFilingsTableSort: any;
  sortTableSequence: any;
  setRecentFilingsTableSortSequence: any;
  recentFilings: any;
  recentFilingsHelper: any;
  waitingForResponse: boolean;
  openCaseDocumentDownloadUrlSequence: any;
  showModal: string;
  showCaseStatusInfoSequence: any;
};

export const RecentFilings = connect(
  {
    recentFilingsTableSort: state.recentFilingsTableSort,
    sortTableSequence: sequences.sortTableSequence,
    setRecentFilingsTableSortSequence:
      sequences.setRecentFilingsTableSortSequence,
    recentFilings: state.recentFilings,
    recentFilingsHelper: state.recentFilingsHelper,
    waitingForResponse: state.progressIndicator.waitingForResponse,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showModal: state.modal.showModal,
    showCaseStatusInfoSequence: sequences.showCaseStatusInfoSequence,
  },
  function RecentFilings({
    recentFilingsTableSort,
    sortTableSequence,
    setRecentFilingsTableSortSequence,
    recentFilings,
    recentFilingsHelper,
    waitingForResponse,
    openCaseDocumentDownloadUrlSequence,
    showModal,
    showCaseStatusInfoSequence,
  }: RecentFilingsProps) {
    const paginatorTop = useRef<HTMLDivElement>(null);
    const paginatorBottom = useRef<HTMLDivElement>(null);

    const currentDate = useMemo(() => {
      const today = createISODateString();
      const currentDate = calculateISODate({
        dateString: today,
        howMuch: 0,
        units: 'days',
      });
      return formatDateString(currentDate, FORMATS.MMDDYYYY);
    }, []);

    const sortedData =
      recentFilingsHelper?.sortedRecentFilings || recentFilings || [];

    const PAGE_SIZE = 100;
    const { activePage, pageRecords, setActivePage, totalPages } =
      useClientSidePaginator(sortedData, PAGE_SIZE);

    return (
      <div data-testid="recent-filings-page">
        <NonMobile>
          <RecentFilingsNonMobile
            recentFilingsTableSort={recentFilingsTableSort}
            sortTableSequence={sortTableSequence}
            recentFilingsHelper={recentFilingsHelper}
            openCaseDocumentDownloadUrlSequence={
              openCaseDocumentDownloadUrlSequence
            }
            currentDate={currentDate}
            paginatorTop={paginatorTop}
            paginatorBottom={paginatorBottom}
            activePage={activePage}
            pageRecords={pageRecords as RecentFiling[]}
            setActivePage={setActivePage}
            count={sortedData.length}
            totalPages={totalPages}
            isLoading={waitingForResponse}
            showCaseStatusInfoSequence={showCaseStatusInfoSequence}
          />
        </NonMobile>

        <Mobile>
          <RecentFilingsMobile
            recentFilingsTableSort={recentFilingsTableSort}
            setRecentFilingsTableSortSequence={
              setRecentFilingsTableSortSequence
            }
            recentFilingsHelper={recentFilingsHelper}
            openCaseDocumentDownloadUrlSequence={
              openCaseDocumentDownloadUrlSequence
            }
            currentDate={currentDate}
            paginatorTop={paginatorTop}
            activePage={activePage}
            pageRecords={pageRecords as RecentFiling[]}
            setActivePage={setActivePage}
            count={sortedData.length}
            totalPages={totalPages}
            isLoading={waitingForResponse}
            showCaseStatusInfoSequence={showCaseStatusInfoSequence}
          />
        </Mobile>

        {showModal === 'CaseStatusInfoModal' && <CaseStatusInfoModal />}
      </div>
    );
  },
);
