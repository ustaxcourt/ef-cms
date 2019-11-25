import { BigHeader } from './BigHeader';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import React from 'react';

export const PublicSearch = () => {
  return (
    <>
      <h1>Header Placeholder</h1>
      <NonMobile>
        <BigHeader text="Search for a Case" />

        <section className="usa-section grid-container advanced-search">
          <p>
            Anyone can search for a case in our system for cases filed{' '}
            <span className="text-semibold">on or after May 1, 1986</span>. If
            you aren’t affiliated with that case, you will only see limited
            information about that case.
          </p>
        </section>
      </NonMobile>
      <Mobile>
        <BigHeader text="Welcome to the U.S Tax Court’s Case Management System" />

        <section className="usa-section grid-container advanced-search">
          <h2>Search for a Case</h2>
          <p>
            Anyone can search for a case in our system for cases filed{' '}
            <span className="text-semibold">on or after May 1, 1986</span>. If
            you aren’t affiliated with that case, you will only see limited
            information about that case.
          </p>
        </section>
      </Mobile>
    </>
  );
};
