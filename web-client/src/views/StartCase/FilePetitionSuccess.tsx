import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FilePetitionSuccess = connect(
  { docketNumberWithSuffix: state.formattedCaseDetail.docketNumberWithSuffix },
  function FilePetitionSuccess({ docketNumberWithSuffix }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-0" />

        <section className="usa-section grid-container">
          <p>
            Your case has been assigned Docket Number {docketNumberWithSuffix}.
          </p>

          <p>
            Once your Petition is processed by the Court, you’ll be able to see
            and print a confirmation page under the Case Information tab in your
            case. You’ll also be able to check the status of your case, submit
            new documents, and view activity on the case on the docket record.
          </p>
          <strong>Next steps</strong>

          <ul className="usa-list steps-after-filing">
            <li>
              You’ll need to pay a filing fee or submit a waiver. You can view
              all the options for this on your &quot;My Cases&quot; page.
            </li>
            <li>
              As new info about the case becomes available you will be notified.
            </li>
          </ul>

          <Button
            className="tablet-full-width"
            href="/"
            id="button-back-to-dashboard"
          >
            View Dashboard
          </Button>
        </section>
      </>
    );
  },
);

FilePetitionSuccess.displayName = 'FilePetitionSuccess';
