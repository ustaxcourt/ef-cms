import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { PublicCaseSearchForm } from './PublicCaseSearchForm';
import { PublicOrderSearch } from './PublicOrderSearch';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicSearch = connect({}, function PublicSearch() {
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
            <PublicCaseSearchForm />
          </Tab>
          <Tab id="tab-order" tabName="order" title="Order">
            <PublicOrderSearch />
            {/* <PublicOrderSearchResults /> */}
          </Tab>
        </Tabs>
      </section>
    </>
  );
});
