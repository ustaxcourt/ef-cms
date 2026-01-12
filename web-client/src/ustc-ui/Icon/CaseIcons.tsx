import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { WrappedIcon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';
import classNames from 'classnames';

export function CaseIcons({ formattedCase }: { formattedCase: any }) {
  return (
    <div
      className="multi-filing-type-icon"
      style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem' }} // USWDS overwrites these styles at certain breakpoints even with !important
    >
      <WrappedIcon
        icon="flag"
        iconClass="aged-case-flag"
        spanClass={
          formattedCase.isAgedCase ? 'visibility-visible' : 'visibility-hidden'
        }
        spanDataTestId={`case-aged-icon-${formattedCase.docketNumber}`}
        title="There has not been activity on this case for the past 12 months."
      />
      <WrappedIcon
        spanClass={
          formattedCase.isSealed ? 'visibility-visible' : 'visibility-hidden'
        }
        spanDataTestId="case-sealed-icon"
        title="Sealed"
        icon="lock"
        iconAriaLabel="Sealed"
        iconClass="sealed-case-entry"
      />
      <WrappedIcon
        spanClass={
          formattedCase.remoteTrialGranted ? 'visibility-visible' : 'visibility-hidden'
        }
        spanDataTestId="laptop"
        title="Motion to Proceed Remotely Granted"
        icon="laptop"
        iconAriaLabel="Motion to Proceed Remotely Granted"
        iconClass="tw:text-primary"
      />
      <span
        className={classNames({
          'margin-left-2':
            formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase,
        })}
      >
        <ConsolidatedCaseIcon
          consolidatedIconTooltipText={
            formattedCase.consolidatedIconTooltipText
          }
          inConsolidatedGroup={formattedCase.inConsolidatedGroup}
          showLeadCaseIcon={formattedCase.isLeadCase}
        />
      </span>
    </div>
  );
}
