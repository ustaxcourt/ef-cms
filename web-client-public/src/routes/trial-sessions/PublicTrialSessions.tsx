import { TrialSessionTypes } from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { getPublicTrialSessionsInteractor } from '@shared/proxies/trialSessions/getPublicTrialSessionsProxy';
import { getPublicUsersInSectionInteractor } from '@shared/proxies/users/getPublicUsersInSectionProxy';
import { useQuery } from '@tanstack/react-query';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { applicationContextPublic } from '@web-client/applicationContextPublic';
import {
  TrialSessionRow,
  TrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import {
  Mobile,
  NonMobile,
  NonPhone,
} from '@web-client/ustc-ui/Responsive/Responsive';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';
import { BigHeader } from '@web-client/views/BigHeader';
import React, { ReactNode, useRef, useState } from 'react';
import { publicDefaultLayoutRoute } from 'web-client-public/src/routes/_default-layout/_defaultLayoutComponent';
import { publicTrialSessionsComputed } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessionsComputed';
import { PublicTrialSessionsFilters } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsTable } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessionsTable';

export function PublicTrialSessionsPage() {
  const {
    data: publicTrialSessionsData,
    isLoading: isLoadingTrialSessions,
    error: errorFetchingTrialSessions,
  } = useQuery({
    queryKey: ['/public-api/trial-sessions'],
    queryFn: () => getPublicTrialSessionsInteractor(applicationContextPublic),
  });

  const {
    data: judges,
    isLoading: isLoadingJudges,
    error: errorFetchingJudges,
  } = useQuery({
    queryKey: ['/public-api/sections'],
    queryFn: () =>
      getPublicUsersInSectionInteractor(applicationContextPublic, {
        section: 'judge',
      }),
  });
  const trialSessionFilters = publicTrialSessionsRoute.useSearch();

  const fetchedTrialSessionsTimestamp = formatNow(
    FORMATS.CURRENT_AS_OF_TIMESTAMP,
  );
  const navigate = useNavigate({ from: '/trial-sessions' });

  if (publicTrialSessionsData && judges) {
    const {
      filtersHaveBeenModified,
      sessionTypeOptions,
      trialCitiesByState,
      trialSessionRows,
      trialSessionsCount,
      judgeOptions,
    } = publicTrialSessionsComputed({
      trialSessionFilters,
      trialSessions: publicTrialSessionsData,
      trialSessionJudges: judges,
    });
    return (
      <PublicTrialSessions
        fetchedTrialSessionsTimestamp={fetchedTrialSessionsTimestamp}
        trialSessionFilters={trialSessionFilters}
        setTrialSessionsFilters={filters => {
          void navigate({ search: filters });
        }}
        trialSessionRows={trialSessionRows}
        filtersHaveBeenModified={filtersHaveBeenModified}
        judgeOptions={judgeOptions}
        sessionTypeOptions={sessionTypeOptions}
        trialCitiesByState={trialCitiesByState}
        trialSessionsCount={trialSessionsCount}
      />
    );
  }

  if (isLoadingTrialSessions || isLoadingJudges) return <div>Loading...</div>;
  if (errorFetchingTrialSessions || errorFetchingJudges)
    return <div>Error loading trial sessions.</div>;
}

export function PublicTrialSessions({
  trialSessionFilters,
  setTrialSessionsFilters,
  trialSessionRows,
  fetchedTrialSessionsTimestamp,
  filtersHaveBeenModified,
  judgeOptions,
  sessionTypeOptions,
  trialCitiesByState,
  trialSessionsCount,
}: {
  trialSessionFilters: TrialSessionFilters;
  setTrialSessionsFilters: (filters: TrialSessionFilters) => void;
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  fetchedTrialSessionsTimestamp: string;
  filtersHaveBeenModified: boolean;
  judgeOptions: Array<{ label: string; value: string }>;
  sessionTypeOptions: Array<{ label: string; value: string }>;
  trialCitiesByState: Array<{
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }>;
  trialSessionsCount: number;
}) {
  return (
    <>
      <BigHeader text="Scheduled Trial Sessions" />
      <NonMobilePublicTrialSessions
        fetchedTrialSessionsTimestamp={fetchedTrialSessionsTimestamp}
        trialSessionsFilters={trialSessionFilters}
        setTrialSessionsFilters={setTrialSessionsFilters}
        trialSessionRows={trialSessionRows}
        filtersHaveBeenModified={filtersHaveBeenModified}
        judgeOptions={judgeOptions}
        sessionTypeOptions={sessionTypeOptions}
        trialCitiesByState={trialCitiesByState}
        trialSessionsCount={trialSessionsCount}
      />
      {/* <MobilePublicTrialSessions
        fetchedTrialSessionsTimestamp={fetchedTrialSessionsTimestamp}
        trialSessionsFilters={trialSessionFilters}
      /> */}
    </>
  );
}

function NonMobilePublicTrialSessions({
  fetchedTrialSessionsTimestamp,
  trialSessionsFilters,
  setTrialSessionsFilters,
  trialSessionRows,
  sessionTypeOptions,
  trialCitiesByState,
  judgeOptions,
  filtersHaveBeenModified,
  trialSessionsCount,
}: {
  fetchedTrialSessionsTimestamp: string;
  filtersHaveBeenModified: boolean;
  trialSessionsFilters: TrialSessionFilters;
  setTrialSessionsFilters: (filters: TrialSessionFilters) => void;
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  sessionTypeOptions: {
    label: string;
    value: string;
  }[];
  trialCitiesByState: {
    label: string;
    options: { label: string; value: string }[];
  }[];
  judgeOptions: {
    label: string;
    value: string;
  }[];
  trialSessionsCount: number;
}) {
  const { activePage, setActivePage, pageRecords, totalPages } =
    useClientSidePaginator(trialSessionRows, 100);

  return (
    <NonPhone>
      <section className="usa-section grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-8 grid-col-12 padding-top-2">
            <FetchedTimeMessage
              fetchedDateString={fetchedTrialSessionsTimestamp}
            ></FetchedTimeMessage>
            <Mobile>
              <div className="tablet:grid-col-4 grid-col-12 padding-top-1">
                <PublicTrialSessionsRemoteProceedingsCard />
              </div>
            </Mobile>
            <PublicTrialSessionsFilters
              sessionTypeOptions={sessionTypeOptions}
              trialCitiesByState={trialCitiesByState}
              judgeOptions={judgeOptions}
              trialSessionsFilters={trialSessionsFilters}
              setTrialSessionsFilters={setTrialSessionsFilters}
            />
          </div>
          <NonMobile>
            <div className="tablet:grid-col-4 grid-col-12 padding-top-1">
              <PublicTrialSessionsRemoteProceedingsCard />
            </div>
          </NonMobile>
        </div>
        <div className="grid-row">
          <Button
            link
            data-testid="trial-sessions-reset-filters-button"
            disabled={!filtersHaveBeenModified}
            onClick={() => {
              setTrialSessionsFilters(defaultTrialSessionFilters);
            }}
          >
            Reset Filters
          </Button>
        </div>
        <div className="grid-row padding-top-1">
          <TablePagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={page => {
              setActivePage(page);
            }}
          >
            <PublicTrialSessionsTable
              trialSessionRows={pageRecords}
              trialSessionsCount={trialSessionsCount}
            />
          </TablePagination>
        </div>
      </section>
    </NonPhone>
  );
}

// function MobilePublicTrialSessions({
//   displayProgressSpinnerSequence,
//   fetchedTrialSessionsTimestamp,
//   trialSessionsFilters,
//   publicTrialSessionsHelper,
//   resetPublicTrialSessionsDataSequence,
//   updateFormValueSequence,
// }: {
//   fetchedTrialSessionsTimestamp: string;
//   trialSessionsFilters: TrialSessionFilters;
// }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const publicTrialSessionUpdateFormValueSequence = (
//     ...args: Parameters<typeof updateFormValueSequence>
//   ) => {
//     if (displayProgressSpinnerSequence)
//       displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
//     updateFormValueSequence(...args);
//     updateFormValueSequence({
//       key: 'pageNumber',
//       root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
//       value: 0,
//     });
//   };

//   return (
//     <Phone>
//       <section className="usa-section grid-container">
//         <FetchedTimeMessage
//           fetchedDateString={fetchedTrialSessionsTimestamp}
//         ></FetchedTimeMessage>
//         <div className="padding-top-3">
//           <PublicTrialSessionsRemoteProceedingsCard />
//         </div>

//         <Accordion onClick={() => setIsOpen(!isOpen)}>
//           <AccordionItem contentClassName="display-none" title="Filters">
//             {''}
//           </AccordionItem>
//         </Accordion>

//         {isOpen && (
//           <>
//             <PublicTrialSessionsFilters
//               displayProgressSpinnerSequence={displayProgressSpinnerSequence}
//               judges={trialSessionsFilters.judges}
//               locations={trialSessionsFilters.locations}
//               proceedingType={trialSessionsFilters.proceedingType}
//               sessionTypeOptions={publicTrialSessionsHelper.sessionTypeOptions}
//               sessionTypes={trialSessionsFilters.sessionTypes}
//               trialCitiesByState={publicTrialSessionsHelper.trialCitiesByState}
//               trialSessionJudgeOptions={
//                 publicTrialSessionsHelper.trialSessionJudgeOptions
//               }
//               updateFormValueSequence={updateFormValueSequence}
//             />
//             <Button
//               link
//               data-testid="trial-sessions-reset-filters-button"
//               disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
//               onClick={() => {
//                 resetPublicTrialSessionsDataSequence();
//                 displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
//               }}
//             >
//               Reset Filters
//             </Button>
//           </>
//         )}

//         <div className="padding-top-2">
//           {Object.entries(trialSessionsFilters.sessionTypes).map(
//             ([sessionTypeKey, sessionTypeLabel]) => (
//               <PillButton
//                 key={sessionTypeLabel}
//                 text={sessionTypeLabel}
//                 onRemove={() => {
//                   publicTrialSessionUpdateFormValueSequence({
//                     key: `sessionTypes.${sessionTypeKey}`,
//                     root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
//                     value: undefined,
//                   });
//                 }}
//               />
//             ),
//           )}

//           {Object.entries(trialSessionsFilters.locations).map(
//             ([sessionTypeKey, sessionTypeLabel]) => (
//               <PillButton
//                 key={sessionTypeLabel}
//                 text={sessionTypeLabel}
//                 onRemove={() => {
//                   publicTrialSessionUpdateFormValueSequence({
//                     key: `locations.${sessionTypeKey}`,
//                     root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
//                     value: undefined,
//                   });
//                 }}
//               />
//             ),
//           )}

//           {Object.entries(trialSessionsFilters.judges).map(
//             ([sessionTypeKey, sessionTypeLabel]) => (
//               <PillButton
//                 key={sessionTypeLabel}
//                 text={sessionTypeLabel}
//                 onRemove={() => {
//                   publicTrialSessionUpdateFormValueSequence({
//                     key: `judges.${sessionTypeKey}`,
//                     root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
//                     value: undefined,
//                   });
//                 }}
//               />
//             ),
//           )}
//         </div>
//         <TablePagination
//           pageNumber={publicTrialSessionsData.pageNumber || 0}
//           totalPages={publicTrialSessionsHelper.totalPages}
//           updateFormValueSequence={updateFormValueSequence}
//         >
//           <PublicMobileTrialSessionsTable />
//         </TablePagination>
//       </section>
//     </Phone>
//   );
// }

function FetchedTimeMessage({
  fetchedDateString,
}: {
  fetchedDateString: string;
}) {
  return (
    <div>Information on this page is current as of {fetchedDateString}.</div>
  );
}

function TablePagination({
  activePage,
  totalPages,
  onPageChange,
  children,
}: {
  activePage: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
  children: ReactNode;
}) {
  const paginatorTop = useRef(null);
  if (totalPages <= 1) return children;
  return (
    <>
      <div className="width-full grid-row margin-bottom-1 padding-top-1 flex-align-center">
        <div className="grid-col" ref={paginatorTop}>
          <Paginator
            currentPageIndex={activePage}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              onPageChange(selectedPage);
              focusPaginatorTop(paginatorTop);
            }}
          />
          <div className="grid-col-2"></div>
        </div>
      </div>

      {children}
      <div className="width-full grid-row margin-bottom-2 padding-top-3 flex-align-center">
        <div className="grid-col">
          <Paginator
            currentPageIndex={activePage}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              onPageChange(selectedPage);
              focusPaginatorTop(paginatorTop);
            }}
          />
          <div className="grid-col-2"></div>
        </div>
      </div>
    </>
  );
}

function PublicTrialSessionsRemoteProceedingsCard() {
  return (
    <>
      <div className="card" data-testid="remote-proceedings-card">
        <div className="card-header padding-left-2 padding-top-2">
          <h2>Remote Proceedings</h2>
        </div>
        <div className="margin-left-2 margin-right-2 border-bottom-1px border-base-lighter"></div>
        <div className="card-content">
          <div className="padding-left-2 margin-bottom-3">
            <div>
              <Button
                link
                className="padding-bottom-0 text-left"
                href="https://www.ustaxcourt.gov/remote_proceedings.html"
              >
                Public Access to Remote Proceedings
              </Button>
            </div>
            <div>
              <Button
                link
                className="text-left"
                href="https://www.ustaxcourt.gov/zoomgov.html"
              >
                Zoomgov Proceedings Resources
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const defaultTrialSessionFilters: TrialSessionFilters = {
  judges: {},
  locations: {},
  proceedingType: 'All',
  sessionTypes: {},
};

export type TrialSessionFilters = {
  judges: Record<string, { name: string; userId: string }>;
  locations: Record<string, string>;
  sessionTypes: Record<string, TrialSessionTypes>;
  proceedingType: string;
};

export const publicTrialSessionsRoute = createRoute({
  component: PublicTrialSessionsPage,
  getParentRoute: () => publicDefaultLayoutRoute,
  path: '/trial-sessions',
  validateSearch: (stuff: { hello: number }) => {
    console.log('ValidateSearch', stuff);
    return stuff as unknown as TrialSessionFilters;
  },
});
