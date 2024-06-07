import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { DocumentSearchResults } from '../AdvancedSearch/DocumentSearchResults';
import { ErrorNotification } from '../ErrorNotification';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { OpinionSearchForm } from '../AdvancedSearch/OpinionSearchForm';
import { OrderSearchForm } from '../AdvancedSearch/OrderSearchForm';
import { PractitionerSearchForm } from '@web-client/views/AdvancedSearch/PractitionerSearchForm';
import { PractitionerSearchResults } from '@web-client/views/AdvancedSearch/PractitionerSearchResults';
import { SearchBoilerplateText } from './SearchBoilerplateText';
import { SearchResults } from '../AdvancedSearch/SearchResults';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PublicSearch = connect(
  {
    advancedSearchTabChangeSequence: sequences.advancedSearchTabChangeSequence,
    mobileSelection: state.advancedSearchForm.mobileSelection,
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
    mobileSelection,
    submitPublicCaseAdvancedSearchSequence,
    submitPublicCaseDocketNumberSearchSequence,
    submitPublicOpinionAdvancedSearchSequence,
    submitPublicOrderAdvancedSearchSequence,
  }) {
    function CaseRender() {
      return (
        <>
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
        </>
      );
    }

    function OrderRender() {
      return (
        <>
          <SearchBoilerplateText formTypeText="an order" />
          <OrderSearchForm
            submitAdvancedSearchSequence={
              submitPublicOrderAdvancedSearchSequence
            }
          />
          <DocumentSearchResults />
        </>
      );
    }

    function OpinionRender() {
      return (
        <>
          <SearchBoilerplateText formTypeText="an opinion" isOpinion="true" />
          <OpinionSearchForm
            submitAdvancedSearchSequence={
              submitPublicOpinionAdvancedSearchSequence
            }
          />
          <DocumentSearchResults />
        </>
      );
    }

    function PractitionerRender() {
      return (
        <>
          <>
            <p className="margin-top-0">
              The information provided in the search results below is maintained
              by the Admissions Clerk of the U.S. Tax Court. Practitioners may:
            </p>
            <ul>
              <li>
                Update their contact information by logging into DAWSON and
                updating their practitioner accounts.
              </li>{' '}
              <li>
                Change thier practitioner type, practice type, or admission
                status by contacting the Admissions Clerk at{' '}
                <a href="mailto:admissions@ustaxcourt.gov">
                  admissions@ustaxcourt.gov
                </a>
                .
              </li>
            </ul>
          </>
          <PractitionerSearchForm isPublicUser={true}></PractitionerSearchForm>

          <PractitionerSearchResults
            isPublicUser={true}
          ></PractitionerSearchResults>
        </>
      );
    }

    return (
      <>
        <BigHeader text="Search" />

        <section className="usa-section grid-container advanced-search">
          <ErrorNotification />
          <SuccessNotification />
          <WarningNotification />

          <NonMobile>
            <Tabs
              bind="advancedSearchTab"
              className="classic-horizontal-header3 tab-border"
              headingLevel="2"
              onSelect={() => {
                advancedSearchTabChangeSequence();
              }}
            >
              <Tab id="tab-case" tabName="case" title="Case">
                {CaseRender()}
              </Tab>
              <Tab
                data-testid="order-search-tab"
                tabName="order"
                title={'Order'}
              >
                {OrderRender()}
              </Tab>
              <Tab
                data-testid="opinion-search-tab"
                tabName="opinion"
                title={'Opinion'}
              >
                {OpinionRender()}
                <DocumentSearchResults />
              </Tab>
              <Tab
                data-testid="practitioner-search-tab"
                tabName="practitioner"
                title={'Practitioner'}
              >
                {PractitionerRender()}
              </Tab>
            </Tabs>
          </NonMobile>

          <Mobile>
            <div className="grid-row">
              <select
                aria-label="additional case info"
                className="usa-select margin-bottom-2"
                onChange={e => {
                  console.log({ tabName: e.target.value });
                  advancedSearchTabChangeSequence({
                    mobileSelection: e.target.value,
                  });
                }}
              >
                <option value="case">Case</option>
                <option value="order">Order</option>
                <option value="opinion">Opinion</option>
                <option value="practitioner">Practitioner</option>
              </select>
            </div>

            {mobileSelection === 'case' && CaseRender()}
            {mobileSelection === 'order' && OrderRender()}
            {mobileSelection === 'opinion' && OpinionRender()}
            {(!mobileSelection || mobileSelection === 'practitioner') &&
              PractitionerRender()}
          </Mobile>
        </section>
      </>
    );
  },
);

PublicSearch.displayName = 'PublicSearch';
