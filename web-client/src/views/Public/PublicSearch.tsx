import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from '../AdvancedSearch/CaseSearchForm';
import { DocumentSearchResults } from '../AdvancedSearch/DocumentSearchResults';
import { ErrorNotification } from '../ErrorNotification';
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
            <Tab data-testid="order-search-tab" tabName="order" title={'Order'}>
              <SearchBoilerplateText formTypeText="an order" />
              <OrderSearchForm
                submitAdvancedSearchSequence={
                  submitPublicOrderAdvancedSearchSequence
                }
              />
              <DocumentSearchResults />
            </Tab>
            <Tab
              data-testid="opinion-search-tab"
              tabName="opinion"
              title={'Opinion'}
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
            <Tab
              data-testid="practitioner-search-tab"
              tabName="practitioner"
              title={'Practitioner'}
            >
              <>
                <p className="margin-top-0">
                  The information provided in the search results below is
                  maintained by the Admissions Clerk of the U.S. Tax Court.
                  Practitioners may:
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
              <PractitionerSearchForm
                isPublicUser={true}
              ></PractitionerSearchForm>

              <PractitionerSearchResults
                isPublicUser={true}
              ></PractitionerSearchResults>
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

PublicSearch.displayName = 'PublicSearch';
