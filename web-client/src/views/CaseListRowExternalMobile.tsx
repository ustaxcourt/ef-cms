import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import React from 'react';
import classNames from 'classnames';

const getCaseRowMobile = ({
  formattedCase,
  isNestedCase,
  onlyLinkIfRequestedUserAssociated,
  onlyText,
  showFilingFee,
}) => {
  return (
    <React.Fragment key={formattedCase.docketNumber}>
      <tr data-testid={formattedCase.docketNumber} style={{ display: 'flex' }}>
        <div className="mobile-column-width-75">
          <td>
            <span
              className={classNames({
                'margin-left-2':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
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
          </td>
          <td>{formattedCase.createdAtFormatted}</td>
          <td>
            <div className={isNestedCase ? 'margin-left-2' : ''}>
              <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
            </div>
            {formattedCase.caseTitle}
          </td>
        </div>
        <div className="mobile-column-width-25">
          {showFilingFee && (
            <td
              data-testid="petition-payment-status"
              style={{ float: 'right' }}
            >
              {formattedCase.petitionPaymentStatus}
            </td>
          )}
        </div>
      </tr>
      {formattedCase.consolidatedCases &&
        formattedCase.consolidatedCases.map(consolidatedCase =>
          getCaseRowMobile({
            formattedCase: consolidatedCase,
            isNestedCase: true,
            onlyLinkIfRequestedUserAssociated,
            onlyText:
              onlyLinkIfRequestedUserAssociated &&
              consolidatedCase.isRequestingUserAssociated === false,
            showFilingFee,
          }),
        )}
    </React.Fragment>
  );
};

export const CaseListRowExternalMobile = ({
  formattedCase,
  onlyLinkIfRequestedUserAssociated,
  showFilingFee,
}) =>
  getCaseRowMobile({
    formattedCase,
    isNestedCase: false,
    onlyLinkIfRequestedUserAssociated,
    onlyText:
      onlyLinkIfRequestedUserAssociated &&
      formattedCase.isRequestingUserAssociated === false,
    showFilingFee,
  });

CaseListRowExternalMobile.displayName = 'CaseListRowExternalMobile';
