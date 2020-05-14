import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from './CaseSearchForm';
import { DocumentSearchResults } from './DocumentSearchResults';
import { ErrorNotification } from '../ErrorNotification';
import { OpinionSearchForm } from './OpinionSearchForm';
import { OpinionSearchResults } from './OpinionSearchResults';
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
          <ErrorNotification />
          <Tabs
            bind="advancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            defaultActiveTab="case"
            onSelect={() => {
              advancedSearchTabChangeSequence();
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
                submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
                submitDocketNumberSearchSequence={
                  submitCaseDocketNumberSearchSequence
                }
              />
              <SearchResults />
            </Tab>
            <Tab id="tab-order" tabName="order" title="Order">
              <OrderSearchForm
                submitAdvancedSearchSequence={submitOrderAdvancedSearchSequence}
              />
              <DocumentSearchResults />
            </Tab>
            <Tab id="tab-opinion" tabName="opinion" title="Opinion">
              <OpinionSearchForm
                submitAdvancedSearchSequence={
                  submitOpinionAdvancedSearchSequence
                }
              />
              <OpinionSearchResults />
            </Tab>
            {advancedSearchHelper.showPractitionerSearch && (
              <Tab
                id="tab-practitioner"
                tabName="practitioner"
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
