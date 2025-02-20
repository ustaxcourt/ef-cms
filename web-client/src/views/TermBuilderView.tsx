import { connect } from '@web-client/presenter/shared.cerebral';
import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';

export const TermBuilderView = connect({}, function TermBuilderView() {
  return (
    <>
      <BigHeader text="Term Builder" />
      <section className="usa-section grid-container">
        <Accordion>
          <AccordionItem
            title="Sessions and case inventory"
            contentClassName="term-builder-form"
          >
            <p>
              Only 1 session per location and week will be created. All Special
              sessions already scheduled will be included.
            </p>

            <p>
              Maximum of <input type="number"></input> trial sessions per week.
            </p>

            <p>
              Maximum of <input type="number"></input> trial sessions per
              location per term.
            </p>

            <p>
              Small cases: Minimum of <input type="number"></input> and maximum
              of <input type="number"></input> per trial session.
            </p>

            <p>
              Regular Cases: Minimum of <input type="number"></input> and
              maximum of <input type="number"></input> per trial session.
            </p>

            <p>
              Hybrid Cases: Minimum of <input type="number"></input> Small and
              Regular added together and maximum of{' '}
              <input type="number"></input> per trial session per location.
            </p>

            <p>
              If there are less than <input type="number"></input> cases for a
              location, and we have already been there this year, do not
              schedule a session for that location.
            </p>

            <p>
              If there has been no trial (other than specials) in the last two
              terms for a location, a session will be added if there are any
              cases. (This will ignore any minimum cases rules). Motions and
              Hearings will not count as a trial visit to a location.
            </p>

            <p>
              Washington, D.C. - Only one of the two court rooms can be taken by
              a non-special session per week. Only South can be scheduled with
              non-Special sessions.
            </p>

            <p>
              If multiple case types are eligible, the larger set will be
              scheduled first.
            </p>
          </AccordionItem>
        </Accordion>
      </section>
    </>
  );
});

TermBuilderView.displayName = 'TermBuilderView';
