import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { DocumentSearchResults } from '../AdvancedSearch/DocumentSearchResults';
import { OpinionSearchForm } from '../AdvancedSearch/OpinionSearchForm';
import { OrderSearchForm } from '../AdvancedSearch/OrderSearchForm';
import { SearchResults } from '../AdvancedSearch/SearchResults';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    advancedSearchTabChangeSequence: sequences.advancedSearchTabChangeSequence,
    submitPublicCaseAdvancedSearchSequence:
      sequences.submitPublicCaseAdvancedSearchSequence,
    submitPublicCaseDocketNumberSearchSequence:
      sequences.submitPublicCaseDocketNumberSearchSequence,
    submitPublicOpinionAdvancedSearchSequence:
      sequences.submitPublicOpinionAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence:
      sequences.submitPublicOrderAdvancedSearchSequence,
  },
  function PublicSearch({
    advancedSearchTabChangeSequence,
    submitPublicCaseAdvancedSearchSequence,
    submitPublicCaseDocketNumberSearchSequence,
    submitPublicOpinionAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence,
  }) {
    return (
      <>
        <BigHeader text="Search" />

        <section className="usa-section grid-container advanced-search">
          <SuccessNotification />

          <Tabs
            bind="advancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            defaultActiveTab="case"
            headingLevel="2"
            onSelect={() => {
              advancedSearchTabChangeSequence();
            }}
          >
            <Tab id="tab-case" tabName="case" title="Case">
              <p className="margin-top-0">
                Anyone can search for a case in our system for cases filed{' '}
                <span className="text-semibold">on or after May 1, 1986</span>.
              </p>
              <ul>
                <li>
                  {' '}
                  If you aren’t affiliated with a case, you will only see
                  limited information about that case.
                </li>
                <li>Sealed cases will not display in search results.</li>
              </ul>

              <CaseSearchForm
                submitAdvancedSearchSequence={
                  submitPublicCaseAdvancedSearchSequence
                }
                submitDocketNumberSearchSequence={
                  submitPublicCaseDocketNumberSearchSequence
                }
              />
              <SearchResults />
            </Tab>
            <Tab
              disabled
              id="tab-order"
              tabName="order"
              title="Order (Coming Soon)"
            >
              <OrderSearchForm
                submitAdvancedSearchSequence={
                  submitPublicOrderAdvancedSearchSequence
                }
              />
              <DocumentSearchResults />
            </Tab>
            <Tab
              disabled
              id="tab-opinion"
              tabName="opinion"
              title="Opinion (Coming Soon)"
            >
              <OpinionSearchForm
                submitAdvancedSearchSequence={
                  submitPublicOpinionAdvancedSearchSequence
                }
              />
              <DocumentSearchResults />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
