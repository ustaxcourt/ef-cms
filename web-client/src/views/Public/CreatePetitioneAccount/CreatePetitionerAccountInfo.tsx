import { connect } from '@cerebral/react';

import React from 'react';

export const CreatePetitionerAccountInfo = connect({}, () => {
  return (
    <>
      <div className="grid-col-auto mobile-lg:grid-col-10 tablet:grid-col-8 desktop:grid-col-6 padding-x-205">
        <div
          className="
                bg-white
                padding-y-3 padding-x-5
              "
        >
          <h2>Are you filing a petition on behalf of someone else?</h2>
          <p>
            To file a case on behalf of another taxpayer, you must be authorized
            in this Court as provided by the Tax Court Rules of Practice and
            Procedure. Enrolled agents, certified public accountants, and powers
            of attorney who are not admitted to practice before the Court may
            not file a petition on someone else&apos;s behalf or represent a
            taxpayer in a case.
          </p>
          <p>
            For additional questions, contact DAWSON support:{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
          </p>
          <br></br>
          <h2>Are you a practitioner?</h2>
          <p>
            Practitioners need to contact Admissions to have their account
            created and verify admission to practice before the U.S. Tax Court.
          </p>
          <p>
            Email{' '}
            <a href="mailto:admissions@ustaxcourt.gov">
              admissions@ustaxcourt.gov
            </a>{' '}
            with your name and your USTC Bar number (if you have one).
          </p>
          <br></br>
          <h2>Need help?</h2>
          <p>
            Contact DAWSON support:{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
          </p>
        </div>
      </div>
    </>
  );
});

CreatePetitionerAccountInfo.displayName = 'CreatePetitionerAccountInfo';
