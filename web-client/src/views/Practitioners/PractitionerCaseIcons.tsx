import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

// This might be useful for more than just practitioners
export function PractitionerCaseIcons({
  formattedCase,
}: {
  formattedCase: any;
}) {
  return (
    <div className="multi-filing-type-icon">
      {formattedCase.isSealed && (
        <Icon
          aria-label="sealed"
          className="sealed-case-entry"
          icon="lock"
          title="sealed"
        />
      )}
      {formattedCase.inConsolidatedGroup && (
        <span
          className="fa-layers fa-fw"
          title={formattedCase.consolidatedIconTooltipText}
        >
          <Icon
            aria-label={formattedCase.consolidatedIconTooltipText}
            className="fa-icon-blue"
            icon="copy"
          />
          {formattedCase.isLeadCase && (
            <span className="fa-inverse lead-case-icon-text">L</span>
          )}
        </span>
      )}
    </div>
  );
}
