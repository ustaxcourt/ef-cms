import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { TrialSessionTypes } from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { getPublicTrialSessionsInteractor } from '@shared/proxies/trialSessions/getPublicTrialSessionsProxy';
import { useQuery } from '@tanstack/react-query';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { applicationContextPublic } from '@web-client/applicationContextPublic';
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
import React, { useRef, useState } from 'react';
import { publicDefaultLayoutRoute } from 'web-client-public/src/routes/_default-layout/_defaultLayoutComponent';
import { PublicTrialSessionsFilters } from 'web-client-public/src/routes/trial-sessions/PublicTrialSessionsFilters';

export function PublicTrialSessions() {
  const {
    data: publicTrialSessionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['/public-api/trial-sessions'],
    queryFn: () => getPublicTrialSessionsInteractor(applicationContextPublic),
  });
  const urlparams = publicTrialSessionsRoute.useSearch();

  const { activePage, setActivePage, pageRecords, totalPages } =
    useClientSidePaginator(publicTrialSessionsData || [], 100);
  const fetchedTrialSessionsTimestamp = formatNow(
    FORMATS.CURRENT_AS_OF_TIMESTAMP,
  );

  if (publicTrialSessionsData) {
    return (
      <>
        <BigHeader text="Scheduled Trial Sessions" />
        <NonMobilePublicTrialSessions
          fetchedTrialSessionsTimestamp={fetchedTrialSessionsTimestamp}
          trialSessionsFilters={urlparams}
        />
        <MobilePublicTrialSessions
          fetchedTrialSessionsTimestamp={fetchedTrialSessionsTimestamp}
          trialSessionsFilters={urlparams}
        />
      </>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading trial sessions.</div>;
}

function NonMobilePublicTrialSessions({
  displayProgressSpinnerSequence,
  fetchedTrialSessionsTimestamp,
  trialSessionsFilters,
  publicTrialSessionsHelper,
  resetPublicTrialSessionsDataSequence,
  updateFormValueSequence,
}: {
  fetchedTrialSessionsTimestamp: string;
  trialSessionsFilters: TrialSessionFilters;
}) {
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
              displayProgressSpinnerSequence={displayProgressSpinnerSequence}
              judges={trialSessionsFilters.judges}
              locations={trialSessionsFilters.locations}
              proceedingType={trialSessionsFilters.proceedingType}
              sessionTypeOptions={publicTrialSessionsHelper.sessionTypeOptions}
              sessionTypes={trialSessionsFilters.sessionTypes}
              trialCitiesByState={publicTrialSessionsHelper.trialCitiesByState}
              trialSessionJudgeOptions={
                publicTrialSessionsHelper.trialSessionJudgeOptions
              }
              updateFormValueSequence={updateFormValueSequence}
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
            disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
            onClick={() => {
              resetPublicTrialSessionsDataSequence();
              displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
            }}
          >
            Reset Filters
          </Button>
        </div>
        <div className="grid-row padding-top-1">
          <TablePagination
            pageNumber={publicTrialSessionsData.pageNumber || 0}
            totalPages={publicTrialSessionsHelper.totalPages}
            updateFormValueSequence={updateFormValueSequence}
          >
            <PublicTrialSessionsTable />
          </TablePagination>
        </div>
      </section>
    </NonPhone>
  );
}

function MobilePublicTrialSessions({
  displayProgressSpinnerSequence,
  fetchedTrialSessionsTimestamp,
  trialSessionsFilters,
  publicTrialSessionsHelper,
  resetPublicTrialSessionsDataSequence,
  updateFormValueSequence,
}: {
  fetchedTrialSessionsTimestamp: string;
  trialSessionsFilters: TrialSessionFilters;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const publicTrialSessionUpdateFormValueSequence = (
    ...args: Parameters<typeof updateFormValueSequence>
  ) => {
    if (displayProgressSpinnerSequence)
      displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
    updateFormValueSequence(...args);
    updateFormValueSequence({
      key: 'pageNumber',
      root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
      value: 0,
    });
  };

  return (
    <Phone>
      <section className="usa-section grid-container">
        <FetchedTimeMessage
          fetchedDateString={fetchedTrialSessionsTimestamp}
        ></FetchedTimeMessage>
        <div className="padding-top-3">
          <PublicTrialSessionsRemoteProceedingsCard />
        </div>

        <Accordion onClick={() => setIsOpen(!isOpen)}>
          <AccordionItem contentClassName="display-none" title="Filters">
            {''}
          </AccordionItem>
        </Accordion>

        {isOpen && (
          <>
            <PublicTrialSessionsFilters
              displayProgressSpinnerSequence={displayProgressSpinnerSequence}
              judges={trialSessionsFilters.judges}
              locations={trialSessionsFilters.locations}
              proceedingType={trialSessionsFilters.proceedingType}
              sessionTypeOptions={publicTrialSessionsHelper.sessionTypeOptions}
              sessionTypes={trialSessionsFilters.sessionTypes}
              trialCitiesByState={publicTrialSessionsHelper.trialCitiesByState}
              trialSessionJudgeOptions={
                publicTrialSessionsHelper.trialSessionJudgeOptions
              }
              updateFormValueSequence={updateFormValueSequence}
            />
            <Button
              link
              data-testid="trial-sessions-reset-filters-button"
              disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
              onClick={() => {
                resetPublicTrialSessionsDataSequence();
                displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
              }}
            >
              Reset Filters
            </Button>
          </>
        )}

        <div className="padding-top-2">
          {Object.entries(trialSessionsFilters.sessionTypes).map(
            ([sessionTypeKey, sessionTypeLabel]) => (
              <PillButton
                key={sessionTypeLabel}
                text={sessionTypeLabel}
                onRemove={() => {
                  publicTrialSessionUpdateFormValueSequence({
                    key: `sessionTypes.${sessionTypeKey}`,
                    root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
                    value: undefined,
                  });
                }}
              />
            ),
          )}

          {Object.entries(trialSessionsFilters.locations).map(
            ([sessionTypeKey, sessionTypeLabel]) => (
              <PillButton
                key={sessionTypeLabel}
                text={sessionTypeLabel}
                onRemove={() => {
                  publicTrialSessionUpdateFormValueSequence({
                    key: `locations.${sessionTypeKey}`,
                    root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
                    value: undefined,
                  });
                }}
              />
            ),
          )}

          {Object.entries(trialSessionsFilters.judges).map(
            ([sessionTypeKey, sessionTypeLabel]) => (
              <PillButton
                key={sessionTypeLabel}
                text={sessionTypeLabel}
                onRemove={() => {
                  publicTrialSessionUpdateFormValueSequence({
                    key: `judges.${sessionTypeKey}`,
                    root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
                    value: undefined,
                  });
                }}
              />
            ),
          )}
        </div>
        <TablePagination
          pageNumber={publicTrialSessionsData.pageNumber || 0}
          totalPages={publicTrialSessionsHelper.totalPages}
          updateFormValueSequence={updateFormValueSequence}
        >
          <PublicMobileTrialSessionsTable />
        </TablePagination>
      </section>
    </Phone>
  );
}

function FetchedTimeMessage({ fetchedDateString }) {
  return (
    <div>Information on this page is current as of {fetchedDateString}.</div>
  );
}

function TablePagination({
  children,
  pageNumber,
  totalPages,
  updateFormValueSequence,
}) {
  const paginatorTop = useRef(null);
  if (totalPages <= 1) return children;
  return (
    <>
      <div className="width-full grid-row margin-bottom-1 padding-top-1 flex-align-center">
        <div className="grid-col" ref={paginatorTop}>
          <Paginator
            currentPageIndex={pageNumber}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              updateFormValueSequence({
                key: 'pageNumber',
                root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
                value: selectedPage,
              });
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
            currentPageIndex={pageNumber}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              updateFormValueSequence({
                key: 'pageNumber',
                root: PUBLIC_TRIAL_SESSIONS_DATA_KEY,
                value: selectedPage,
              });
              focusPaginatorTop(paginatorTop);
            }}
          />
          <div className="grid-col-2"></div>
        </div>
      </div>
    </>
  );
}

export function PublicTrialSessionsRemoteProceedingsCard() {
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

type TrialSessionFilters = {
  judges: Record<string, { name: string; userId: string }>;
  locations: Record<string, string>;
  sessionTypes: Record<string, TrialSessionTypes>;
  proceedingType: string;
};

export const publicTrialSessionsRoute = createRoute({
  component: PublicTrialSessions,
  getParentRoute: () => publicDefaultLayoutRoute,
  path: '/trial-sessions',
  validateSearch: (stuff: { hello: number }) => {
    console.log('ValidateSearch', stuff);
    return stuff as unknown as TrialSessionFilters;
  },
});
