import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import React from 'react';
import classNames from 'classnames';

export const CaseListRowExternal = ({
  formattedCase,
  isNestedCase,
  onlyLinkIfRequestedUserAssociated,
  onlyText,
  showFilingFee,
}) => {
  return (
    <>
      <NonPhone>
        <React.Fragment key={formattedCase.docketNumber}>
          <tr data-testid={formattedCase.docketNumber}>
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
            <td>
              <div className={isNestedCase ? 'margin-left-2' : ''}>
                <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
              </div>
            </td>
            <td>{formattedCase.caseTitle}</td>
            <td>{formattedCase.createdAtFormatted}</td>
            {showFilingFee && (
              <td data-testid="petition-payment-status">
                {formattedCase.petitionPaymentStatus}
              </td>
            )}
          </tr>
          {formattedCase.consolidatedCases &&
            formattedCase.consolidatedCases.map(consolidatedCase => {
              return (
                <CaseListRowExternal
                  isNestedCase
                  onlyLinkIfRequestedUserAssociated
                  showFilingFee
                  formattedCase={consolidatedCase}
                  key={consolidatedCase.docketNumber}
                  onlyText={
                    onlyLinkIfRequestedUserAssociated &&
                    consolidatedCase.isRequestingUserAssociated === false
                  }
                />
              );
            })}
        </React.Fragment>
      </NonPhone>

      <Phone>
        <tr key={formattedCase.docketNumber}>
          <td data-label="Docket No." style={{ display: 'flex' }}>
            <span
              className={classNames({
                'margin-left-2':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
                'margin-right-2': formattedCase.isLeadCase,
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
            <div className={isNestedCase ? 'margin-left-2' : ''}>
              <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
            </div>
          </td>
          <td data-label="Filed Date">{formattedCase.createdAtFormatted}</td>
          <td data-label="Case Title">{formattedCase.caseTitle}</td>
          {showFilingFee && (
            <td data-label="Filing fee*" data-testid="petition-payment-status">
              {formattedCase.petitionPaymentStatus}
            </td>
          )}
        </tr>
        {formattedCase.consolidatedCases &&
          formattedCase.consolidatedCases.map(consolidatedCase => {
            return (
              <CaseListRowExternal
                isNestedCase
                onlyLinkIfRequestedUserAssociated
                showFilingFee
                formattedCase={consolidatedCase}
                key={consolidatedCase.docketNumber}
                onlyText={
                  onlyLinkIfRequestedUserAssociated &&
                  consolidatedCase.isRequestingUserAssociated === false
                }
              />
            );
          })}
      </Phone>
    </>
  );
};

CaseListRowExternal.displayName = 'CaseListRowExternal';
