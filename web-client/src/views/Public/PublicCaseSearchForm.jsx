import { BigHeader } from '../BigHeader';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicCaseSearchForm = connect(
  {},
  function PublicCaseSearchForm() {
    return (
      <>
        <div className="header-with-blue-background grid-row">
          <h3>Search Cases</h3>
        </div>
        <div className="blue-container order-search-container grid-row">
          <NonMobile>
            <section className="usa-section grid-container advanced-search">
              {/* <CaseSearchForm /> */}
            </section>
          </NonMobile>
          <Mobile>
            <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

            <section className="usa-section grid-container advanced-search">
              <h2>Search for a Case</h2>
              {/* <CaseSearchForm /> */}
            </section>
          </Mobile>
        </div>
      </>
    );
  },
);
