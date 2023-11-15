import { connect } from '@cerebral/react';

import React from 'react';

export const CreatePetitionerAccountInfo = connect({}, () => {
  return (
    <div className="padding-x-205 margin-top-1 grid-col-12 desktop:grid-col-6 create-petitioner-form">
      <h2>Are you filing a petition on behalf of someone else?</h2>
      <p>
        To file a case on behalf of another taxpayer, you must be authorized in
        this Court as provided by the{' '}
        <a
          className="usa-link"
          href="https://ustaxcourt.gov/rules.html"
          rel="noreferrer"
          target="_blank"
        >
          Tax Court Rules of Practice and Procedure
        </a>
        . Enrolled agents, certified public accountants, and powers of attorney
        who are not admitted to practice before the Court may not file a
        petition on someone else&apos;s behalf or represent a taxpayer in a
        case.
      </p>
      <p>
        For additional questions, contact DAWSON support:{' '}
        <a href="mailto:dawson.support@ustaxcourt.gov">
          dawson.support@ustaxcourt.gov
        </a>
      </p>
      <hr />
      <h2>Are you a practitioner?</h2>
      <p>
        Practitioners need to contact Admissions to have their account created
        and verify admission to practice before the U.S. Tax Court.
      </p>
      <p>
        Email{' '}
        <a href="mailto:admissions@ustaxcourt.gov">admissions@ustaxcourt.gov</a>{' '}
        with your name and your USTC Bar number (if you have one).
      </p>
      <hr />
      <h2>Need help?</h2>
      <p>
        Contact DAWSON support:{' '}
        <a href="mailto:dawson.support@ustaxcourt.gov">
          dawson.support@ustaxcourt.gov
        </a>
      </p>
    </div>
  );
});

CreatePetitionerAccountInfo.displayName = 'CreatePetitionerAccountInfo';
