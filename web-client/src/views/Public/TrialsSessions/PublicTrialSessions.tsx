import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { PublicMobileTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicMobileTrialSessionsTable';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsHelperResults } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React, { useRef, useState } from 'react';

const ROOT = 'publicTrialSessionData';

type TrialsSessionsUiParams = {
  publicTrialSessionsHelper: PublicTrialSessionsHelperResults;
  resetPublicTrialSessionDataSequence: () => void;
  updateFormValueSequence: (props: {
    index?: number;
    root?: string;
    key: string;
    value: any;
    allowEmptyString?: boolean;
  }) => void;
  publicTrialSessionData: {
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
  displayProgressSpinnerSequence?: (props: { timeInSeconds: number }) => void;
};

export const PublicTrialSessions = connect(
  {
    displayProgressSpinnerSequence: sequences.displayProgressSpinnerSequence,
    publicTrialSessionData: state[ROOT],
    publicTrialSessionsHelper: state.publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence:
      sequences.resetPublicTrialSessionDataSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function ({
    displayProgressSpinnerSequence,
    publicTrialSessionData,
    publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <BigHeader text="Scheduled Trial Sessions" />

        {NonMobilePublicTrialsSessions({
          publicTrialSessionData,
          publicTrialSessionsHelper,
          resetPublicTrialSessionDataSequence,
          updateFormValueSequence,
        })}
        {MobilePublicTrialsSessions({
          displayProgressSpinnerSequence,
          publicTrialSessionData,
          publicTrialSessionsHelper,
          resetPublicTrialSessionDataSequence,
          updateFormValueSequence,
        })}
      </>
    );
  },
);

function NonMobilePublicTrialsSessions({
  publicTrialSessionData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionDataSequence,
  updateFormValueSequence,
}: TrialsSessionsUiParams) {
  return (
    <NonMobile>
      <section className="usa-section grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-8 grid-col-12 padding-top-2">
            <FetchedTimeMessage
              fetchedDateString={publicTrialSessionsHelper.fetchedDateString}
            ></FetchedTimeMessage>
            <PublicTrialSessionsFilters ROOT={ROOT} />
          </div>
          <div className="tablet:grid-col-4 grid-col-12 padding-top-1">
            <PublicTrialSessionsRemoteProceedingsCard />
          </div>
        </div>
        <div className="grid-row">
          <Button
            link
            data-testid="trial-sessions-reset-filters-button"
            disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
            onClick={() => resetPublicTrialSessionDataSequence()}
          >
            Reset Filters
          </Button>
        </div>
        <div className="grid-row padding-top-1">
          <TablePagination
            pageNumber={publicTrialSessionData.pageNumber || 0}
            totalPages={publicTrialSessionsHelper.totalPages}
            updateFormValueSequence={updateFormValueSequence}
          >
            <PublicTrialSessionsTable />
          </TablePagination>
        </div>
      </section>
    </NonMobile>
  );
}

function MobilePublicTrialsSessions({
  displayProgressSpinnerSequence,
  publicTrialSessionData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionDataSequence,
  updateFormValueSequence,
}: TrialsSessionsUiParams) {
  const {
    judges = {},
    locations = {},
    sessionTypes = {},
  } = publicTrialSessionData;

  const [isOpen, setIsOpen] = useState(false);

  const publicTrialsSessionUpdateFormValueSequence = (
    ...args: Parameters<typeof updateFormValueSequence>
  ) => {
    if (displayProgressSpinnerSequence)
      displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
    updateFormValueSequence(...args);
    updateFormValueSequence({
      key: 'pageNumber',
      root: ROOT,
      value: 0,
    });
  };

  return (
    <Mobile>
      <section className="usa-section grid-container">
        <FetchedTimeMessage
          fetchedDateString={publicTrialSessionsHelper.fetchedDateString}
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
            <PublicTrialSessionsFilters ROOT={ROOT} />
            <Button
              link
              data-testid="trial-sessions-reset-filters-button"
              disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
              onClick={() => resetPublicTrialSessionDataSequence()}
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
                publicTrialsSessionUpdateFormValueSequence({
                  key: `sessionTypes.${sessionTypeKey}`,
                  root: ROOT,
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
                publicTrialsSessionUpdateFormValueSequence({
                  key: `locations.${sessionTypeKey}`,
                  root: ROOT,
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
                publicTrialsSessionUpdateFormValueSequence({
                  key: `judges.${sessionTypeKey}`,
                  root: ROOT,
                  value: undefined,
                });
              }}
            />
          ))}
        </div>
        <TablePagination
          pageNumber={publicTrialSessionData.pageNumber || 0}
          totalPages={publicTrialSessionsHelper.totalPages}
          updateFormValueSequence={updateFormValueSequence}
        >
          <PublicMobileTrialSessionsTable />
        </TablePagination>
      </section>
    </Mobile>
  );
}

function FetchedTimeMessage({ fetchedDateString }) {
  return (
    <>
      <div>Information on this page is current as of {fetchedDateString}.</div>
    </>
  );
}

function TablePagination({
  children,
  pageNumber,
  totalPages,
  updateFormValueSequence,
}) {
  const paginatorTop = useRef(null);
  return (
    <>
      <div className="width-full grid-row margin-bottom-2 padding-top-3 flex-align-center">
        <div className="grid-col" ref={paginatorTop}>
          <Paginator
            currentPageIndex={pageNumber}
            totalPages={totalPages}
            onPageChange={selectedPage => {
              updateFormValueSequence({
                key: 'pageNumber',
                root: ROOT,
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
                root: ROOT,
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
