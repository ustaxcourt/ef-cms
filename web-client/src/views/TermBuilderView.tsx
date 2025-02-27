import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { BigHeader } from '@web-client/views/BigHeader';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { WarningNotification } from '@web-client/views/WarningNotification';
import React from 'react';

type TermBuilderViewProps = {};
const TermBuilderViewDeps = {
  termBuilderInformation: state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  submitCreateTermFormSequence: sequences.submitCreateTermFormSequence,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const TermBuilderView = connect<
  TermBuilderViewProps,
  typeof TermBuilderViewDeps
>(
  TermBuilderViewDeps,
  function TermBuilderView({
    termBuilderInformation,
    submitCreateTermFormSequence,
    updateFormValueSequence,
  }) {
    const {
      maxSessionsPerWeek,
      maxSessionsPerLocation,
      smallCaseMinimumQuantity,
      smallCaseMaxQuantity,
      regularCaseMinimumQuantity,
      regularCaseMaxQuantity,
      hybridCaseMinimumQuantity,
      hybridCaseMaxQuantity,
      termName,
      termStartDate,
      termEndDate,
    } = termBuilderInformation!;
    return (
      <>
        <BigHeader text="Term Builder" />
        <section className="usa-section grid-container">
          <SuccessNotification className="margin-bottom-2" />
          <WarningNotification />
          <ErrorNotification />
          <h2 className="margin-bottom-3">
            {termName} ({termStartDate} - {termEndDate}) Term Builder Rules
          </h2>
          <Accordion>
            <AccordionItem
              title="Sessions and case inventory"
              contentClassName="term-builder-form"
            >
              <p>
                Only 1 session per location and week will be created. All
                Special sessions already scheduled will be included.
              </p>

              <p>
                Maximum of{' '}
                <TermBuilderInput
                  propertyName="maxSessionsPerWeek"
                  currentValue={maxSessionsPerWeek}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                trial sessions per week.
              </p>

              <p>
                Maximum of{' '}
                <TermBuilderInput
                  propertyName="maxSessionsPerLocation"
                  currentValue={maxSessionsPerLocation}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                trial sessions per location per term.
              </p>

              <p>
                Small cases: Minimum of{' '}
                <TermBuilderInput
                  propertyName="smallCaseMinimumQuantity"
                  currentValue={smallCaseMinimumQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                and maximum of{' '}
                <TermBuilderInput
                  propertyName="smallCaseMaxQuantity"
                  currentValue={smallCaseMaxQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                per trial session.
              </p>

              <p>
                Regular Cases: Minimum of{' '}
                <TermBuilderInput
                  propertyName="regularCaseMinimumQuantity"
                  currentValue={regularCaseMinimumQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                and maximum of{' '}
                <TermBuilderInput
                  propertyName="regularCaseMaxQuantity"
                  currentValue={regularCaseMaxQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                per trial session.
              </p>

              <p>
                Hybrid Cases: Minimum of{' '}
                <TermBuilderInput
                  propertyName="hybridCaseMinimumQuantity"
                  currentValue={hybridCaseMinimumQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                Small and Regular added together and maximum of{' '}
                <TermBuilderInput
                  propertyName="hybridCaseMaxQuantity"
                  currentValue={hybridCaseMaxQuantity}
                  updateFormValueSequence={updateFormValueSequence}
                />{' '}
                per trial session per location.
              </p>

              <p>
                If there has been no trial (other than specials) in the last two
                terms for a location, a session will be added if there are any
                cases. (This will ignore any minimum cases rules). Motions and
                Hearings will not count as a trial visit to a location.
              </p>

              <p>
                Washington, D.C. - Only one of the two court rooms can be taken
                by a non-special session per week. Only South can be scheduled
                with non-Special sessions.
              </p>

              <p>
                If multiple case types are eligible, the larger set will be
                scheduled first.
              </p>
            </AccordionItem>
          </Accordion>

          <div className="margin-top-5">
            <Button
              href="javascript:void(0);"
              data-testid="submit-create-term-form-button"
              onClick={async () => {
                await submitCreateTermFormSequence();
              }}
            >
              Create Term
            </Button>
            <Button link href="/trial-sessions">
              Cancel
            </Button>
          </div>
        </section>
      </>
    );
  },
);

type TermBuilderInputParams = {
  propertyName: string;
  currentValue: number;
  updateFormValueSequence: typeof sequences.updateFormValueSequence;
};

function TermBuilderInput({
  currentValue,
  propertyName,
  updateFormValueSequence,
}: TermBuilderInputParams) {
  return (
    <input
      autoCapitalize="none"
      name={propertyName}
      placeholder="Number"
      type="number"
      min="0"
      value={currentValue}
      onChange={e => {
        updateFormValueSequence({
          key: e.target.name,
          value: +e.target.value.split('.').join(''),
          root: STATE_KEYS.TERM_BUILDER_INFORMATION,
        });
      }}
    />
  );
}
