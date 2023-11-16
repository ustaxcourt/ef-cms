import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
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
      <NonMobile>
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
      </NonMobile>

      <Mobile>
        <React.Fragment key={formattedCase.docketNumber}>
          <tr
            data-testid={formattedCase.docketNumber}
            style={{ display: 'flex' }}
          >
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
      </Mobile>
    </>
  );
};

CaseListRowExternal.displayName = 'CaseListRowExternal';
