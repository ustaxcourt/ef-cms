import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { PublicMobileTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicMobileTrialSessionsTable';
import { PublicTrialSessionsFilters } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsFilters';
import { PublicTrialSessionsHelperResults } from '@web-client/presenter/computeds/Public/publicTrialSessionsHelper';
import { PublicTrialSessionsRemoteProceedingsCard } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsRemoteProceedingsCard';
import { PublicTrialSessionsTable } from '@web-client/views/Public/TrialsSessions/PublicTrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

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
};

export const PublicTrialSessions = connect(
  {
    publicTrialSessionData: state[ROOT],
    publicTrialSessionsHelper: state.publicTrialSessionsHelper,
    resetPublicTrialSessionDataSequence:
      sequences.resetPublicTrialSessionDataSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function ({
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
            <div>
              Information on this page is current as of{' '}
              {publicTrialSessionsHelper.fetchedDateString}
            </div>
            <PublicTrialSessionsFilters ROOT={ROOT} />
          </div>
          <div className="tablet:grid-col-4 grid-col-12 padding-top-1">
            <PublicTrialSessionsRemoteProceedingsCard />
          </div>
        </div>
        <div className="grid-row">
          <Button
            link
            disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
            onClick={() => resetPublicTrialSessionDataSequence()}
          >
            Reset Filters
          </Button>
        </div>
        <div className="grid-row padding-top-1">
          <div className="width-full grid-row margin-bottom-2 flex-align-center">
            <div className="grid-col">
              <Paginator
                currentPageIndex={publicTrialSessionData.pageNumber || 0}
                totalPages={publicTrialSessionsHelper.totalPages}
                onPageChange={selectedPage => {
                  updateFormValueSequence({
                    key: 'pageNumber',
                    root: ROOT,
                    value: selectedPage,
                  });
                }}
              />
              <div className="grid-col-2"></div>
            </div>
          </div>

          <PublicTrialSessionsTable />
        </div>
      </section>
    </NonMobile>
  );
}
function MobilePublicTrialsSessions({
  publicTrialSessionData,
  publicTrialSessionsHelper,
  resetPublicTrialSessionDataSequence,
  updateFormValueSequence,
}: TrialsSessionsUiParams) {
  return (
    <Mobile>
      <section className="usa-section grid-container">
        <div>
          Information on this page is current as of{' '}
          {publicTrialSessionsHelper.fetchedDateString}
        </div>
        <div className="padding-top-3">
          <PublicTrialSessionsRemoteProceedingsCard />
        </div>

        <Accordion>
          <AccordionItem contentClassName="bg-gray" title="Filters">
            <PublicTrialSessionsFilters ROOT={ROOT} />
            <Button
              link
              disabled={!publicTrialSessionsHelper.filtersHaveBeenModified}
              onClick={() => resetPublicTrialSessionDataSequence()}
            >
              Reset Filters
            </Button>
          </AccordionItem>
        </Accordion>

        <div className="width-full grid-row margin-bottom-2 padding-top-3 flex-align-center">
          <div className="grid-col">
            <Paginator
              currentPageIndex={publicTrialSessionData.pageNumber || 0}
              totalPages={publicTrialSessionsHelper.totalPages}
              onPageChange={selectedPage => {
                updateFormValueSequence({
                  key: 'pageNumber',
                  root: ROOT,
                  value: selectedPage,
                });
              }}
            />
            <div className="grid-col-2"></div>
          </div>
        </div>

        <PublicMobileTrialSessionsTable />
      </section>
    </Mobile>
  );
}
