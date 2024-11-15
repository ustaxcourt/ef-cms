import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import {
  FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY,
  PUBLIC_TRIAL_SESSIONS_DATA_KEY,
} from '@shared/business/entities/EntityConstants';
import {
  Mobile,
  NonMobile,
  NonPhone,
  Phone,
} from '@web-client/ustc-ui/Responsive/Responsive';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { PublicMobileTrialSessionsTable } from '@web-client/views/Public/TrialSessions/PublicMobileTrialSessionsTable';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsHelperResults } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React, { useRef, useState } from 'react';

type TrialSessionsUiParams = {
  fetchedTrialSessionsTimestamp: string;
  publicTrialSessionsHelper: PublicTrialSessionsHelperResults;
  resetPublicTrialSessionsDataSequence: () => void;
  updateFormValueSequence: (props: {
    index?: number;
    root?: string;
    key: string;
    value: any;
    allowEmptyString?: boolean;
  }) => void;
  publicTrialSessionsData: {
    judges?: {
      [key: string]: string;
    };
    locations?: {
      [key: string]: string;
    };
    sessionTypes?: {
      [key: string]: string;
    };
    pageNumber?: number;
    proceedingType?: string;
  };
  displayProgressSpinnerSequence: (props: { timeInSeconds: number }) => void;
};

export const PublicTrialSessions = connect(
  {
    displayProgressSpinnerSequence: sequences.displayProgressSpinnerSequence,
    fetchedTrialSessionsTimestamp: state[FETCHED_TRIAL_SESSIONS_TIMESTAMP_KEY],
    publicTrialSessionsData: state[PUBLIC_TRIAL_SESSIONS_DATA_KEY],
    publicTrialSessionsHelper: state.publicTrialSessionsHelper,
    resetPublicTrialSessionsDataSequence:
      sequences.resetPublicTrialSessionsDataSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function ({
    displayProgressSpinnerSequence,
    fetchedTrialSessionsTimestamp,
    publicTrialSessionsData,
    publicTrialSessionsHelper,
    resetPublicTrialSessionsDataSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <BigHeader text="Scheduled Trial Sessions" />

        {NonMobilePublicTrialSessions({
          displayProgressSpinnerSequence,
          fetchedTrialSessionsTimestamp,
          publicTrialSessionsData,
          publicTrialSessionsHelper,
          resetPublicTrialSessionsDataSequence,
          updateFormValueSequence,
        })}
        {MobilePublicTrialSessions({
          displayProgressSpinnerSequence,
          fetchedTrialSessionsTimestamp,
          publicTrialSessionsData,
          publicTrialSessionsHelper,
          resetPublicTrialSessionsDataSequence,
          updateFormValueSequence,
        })}
      </>
    );
  },
);

function NonMobilePublicTrialSessions({
  displayProgressSpinnerSequence,
  fetchedTrialSessionsTimestamp,
  publicTrialSessionsData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionsDataSequence,
  updateFormValueSequence,
}: TrialSessionsUiParams) {
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
              judges={publicTrialSessionsData.judges || {}}
              locations={publicTrialSessionsData.locations || {}}
              proceedingType={publicTrialSessionsData.proceedingType || 'All'}
              sessionTypeOptions={publicTrialSessionsHelper.sessionTypeOptions}
              sessionTypes={publicTrialSessionsData.sessionTypes || {}}
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
  publicTrialSessionsData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionsDataSequence,
  updateFormValueSequence,
}: TrialSessionsUiParams) {
  const {
    judges = {},
    locations = {},
    sessionTypes = {},
  } = publicTrialSessionsData;

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
              judges={publicTrialSessionsData.judges || {}}
              locations={publicTrialSessionsData.locations || {}}
              proceedingType={publicTrialSessionsData.proceedingType || 'All'}
              sessionTypeOptions={publicTrialSessionsHelper.sessionTypeOptions}
              sessionTypes={publicTrialSessionsData.sessionTypes || {}}
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
          {Object.entries(
            sessionTypes as {
              [key: string]: string;
            },
          ).map(([sessionTypeKey, sessionTypeLabel]) => (
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
          ))}

          {Object.entries(
            locations as {
              [key: string]: string;
            },
          ).map(([sessionTypeKey, sessionTypeLabel]) => (
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
          ))}

          {Object.entries(
            judges as {
              [key: string]: string;
            },
          ).map(([sessionTypeKey, sessionTypeLabel]) => (
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
          ))}
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
