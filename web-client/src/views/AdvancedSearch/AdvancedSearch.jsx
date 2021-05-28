import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from './CaseSearchForm';
import { DocumentSearchResults } from './DocumentSearchResults';
import { OpinionSearchForm } from './OpinionSearchForm';
import { OrderSearchForm } from './OrderSearchForm';
import { PractitionerSearchForm } from './PractitionerSearchForm';
import { PractitionerSearchResults } from './PractitionerSearchResults';
import { SearchResults } from './SearchResults';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AdvancedSearch = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    advancedSearchTabChangeSequence: sequences.advancedSearchTabChangeSequence,
    searchTabs: state.constants.ADVANCED_SEARCH_TABS,
    submitCaseAdvancedSearchSequence:
      sequences.submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
    submitOpinionAdvancedSearchSequence:
      sequences.submitOpinionAdvancedSearchSequence,
    submitOrderAdvancedSearchSequence:
      sequences.submitOrderAdvancedSearchSequence,
    submitPractitionerBarNumberSearchSequence:
      sequences.submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence:
      sequences.submitPractitionerNameSearchSequence,
  },
  function AdvancedSearch({
    advancedSearchHelper,
    advancedSearchTabChangeSequence,
    searchTabs,
    submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence,
    submitOpinionAdvancedSearchSequence,
    submitOrderAdvancedSearchSequence,
    submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence,
  }) {
    return (
      <>
        <BigHeader text="Advanced Search" />

        <section className="usa-section grid-container advanced-search">
          <SuccessNotification />
          <Tabs
            bind="advancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            defaultActiveTab={searchTabs.CASE}
            headingLevel="2"
            onSelect={() => {
              advancedSearchTabChangeSequence();
            }}
          >
            <Tab id="tab-case" tabName={searchTabs.CASE} title="Case">
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
                submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
                submitDocketNumberSearchSequence={
                  submitCaseDocketNumberSearchSequence
                }
              />
              <SearchResults />
            </Tab>
            <Tab
              disabled
              id="tab-order"
              tabName={searchTabs.ORDER}
              title="Order (Coming Soon)"
            >
              <OrderSearchForm
                submitAdvancedSearchSequence={submitOrderAdvancedSearchSequence}
              />
              <DocumentSearchResults />
            </Tab>
            <Tab
              disabled
              id="tab-opinion"
              tabName={searchTabs.OPINION}
              title="Opinion (Coming Soon)"
            >
              <OpinionSearchForm
                submitAdvancedSearchSequence={
                  submitOpinionAdvancedSearchSequence
                }
              />
              <DocumentSearchResults />
            </Tab>
            {advancedSearchHelper.showPractitionerSearch && (
              <Tab
                id="tab-practitioner"
                tabName={searchTabs.PRACTITIONER}
                title="Practitioner"
              >
                <PractitionerSearchForm
                  submitPractitionerBarNumberSearchSequence={
                    submitPractitionerBarNumberSearchSequence
                  }
                  submitPractitionerNameSearchSequence={
                    submitPractitionerNameSearchSequence
                  }
                />
                <PractitionerSearchResults />
              </Tab>
            )}
          </Tabs>
        </section>
      </>
    );
  },
);
