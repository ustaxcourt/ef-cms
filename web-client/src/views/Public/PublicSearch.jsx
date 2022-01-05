import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { DocumentSearchResults } from '../AdvancedSearch/DocumentSearchResults';
import { ErrorNotification } from '../ErrorNotification';
import { OpinionSearchForm } from '../AdvancedSearch/OpinionSearchForm';
import { OrderSearchForm } from '../AdvancedSearch/OrderSearchForm';
import { SearchBoilerplateText } from './SearchBoilerplateText';
import { SearchResults } from '../AdvancedSearch/SearchResults';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    advancedSearchTabChangeSequence: sequences.advancedSearchTabChangeSequence,
    featureFlagHelper: state.featureFlagHelper,
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
    featureFlagHelper,
    submitPublicCaseAdvancedSearchSequence,
    submitPublicCaseDocketNumberSearchSequence,
    submitPublicOpinionAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence,
  }) {
    return (
      <>
        <BigHeader text="Search" />

        <section className="usa-section grid-container advanced-search">
          <ErrorNotification />
          <SuccessNotification />
          <WarningNotification />

          <Tabs
            bind="advancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            headingLevel="2"
            onSelect={() => {
              advancedSearchTabChangeSequence();
            }}
          >
            <Tab id="tab-case" tabName="case" title="Case">
              <SearchBoilerplateText formTypeText="a case" />
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
              disabled={!featureFlagHelper.isOrderSearchEnabledForRole}
              id="tab-order"
              tabName="order"
              title={
                'Order' +
                (featureFlagHelper.isOrderSearchEnabledForRole
                  ? ''
                  : ' (Coming Soon)')
              }
            >
              <SearchBoilerplateText formTypeText="an order" />
              <OrderSearchForm
                submitAdvancedSearchSequence={
                  submitPublicOrderAdvancedSearchSequence
                }
              />
              <DocumentSearchResults />
            </Tab>
            <Tab
              disabled={!featureFlagHelper.isOpinionSearchEnabledForRole}
              id="tab-opinion"
              tabName="opinion"
              title={
                'Opinion' +
                (featureFlagHelper.isOpinionSearchEnabledForRole
                  ? ''
                  : ' (Coming Soon)')
              }
            >
              <SearchBoilerplateText
                formTypeText="an opinion"
                isOpinion="true"
              />
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
