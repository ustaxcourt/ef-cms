import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';
import classNames from 'classnames';

export function CaseIcons({ formattedCase }: { formattedCase: any }) {
  return (
    <div className="multi-filing-type-icon">
      <div
        className={
          formattedCase.isSealed ? 'visibility-visible' : 'visibility-hidden'
        }
      >
        <Icon
          aria-hidden={!formattedCase.isSealed}
          aria-label="sealed"
          className="sealed-case-entry"
          icon="lock"
          title="sealed"
        />
      </div>
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
