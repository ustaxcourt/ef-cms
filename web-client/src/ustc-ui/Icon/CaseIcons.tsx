import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';
import classNames from 'classnames';

export function CaseIcons({ formattedCase }: { formattedCase: any }) {
  return (
    <div
      className="multi-filing-type-icon"
      style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem' }} // USWDS overwrites these styles at certain breakpoints even with !important
    >
      <span
        className={
          formattedCase.isSealed ? 'visibility-visible' : 'visibility-hidden'
        }
        data-testid="case-sealed-icon"
      >
        <Icon
          aria-hidden={!formattedCase.isSealed}
          aria-label="Sealed"
          className="sealed-case-entry"
          icon="lock"
          title="Sealed"
        />
      </span>
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
