import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { ErrorNotification } from '../ErrorNotification';
import { PublicOrderSearch } from './PublicOrderSearch';
import { SearchResults } from '../AdvancedSearch/SearchResults';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    submitCaseDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence:
      sequences.submitPublicAdvancedSearchSequence,
  },
  function PublicSearch({
    submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence,
  }) {
    return (
      <>
        <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

        <section className="usa-section grid-container advanced-search">
          <SuccessNotification />
          <ErrorNotification />

          <Tabs
            bind="publicAdvancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            onSelect={() => {
              // advancedSearchTabChangeSequence();
            }}
          >
            <Tab id="tab-case" tabName="case" title="Case">
              <p>
                Anyone can search for a case in our system for cases filed{' '}
                <span className="text-semibold">on or after May 1, 1986</span>.
                If you aren’t affiliated with that case, you will only see
                limited information about that case.
              </p>

              <CaseSearchForm
                submitAdvancedSearchSequence={
                  submitPublicAdvancedSearchSequence
                }
                submitDocketNumberSearchSequence={
                  submitCaseDocketNumberSearchSequence
                }
              />
              <SearchResults />
            </Tab>
            <Tab id="tab-order" tabName="order" title="Order">
              <PublicOrderSearch />
              {/* <PublicOrderSearchResults /> */}
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
