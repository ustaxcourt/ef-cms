import { CaseLink } from '../../../ustc-ui/CaseLink/CaseLink';
import { Mobile, NonMobile } from '../../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  caseDetail: unknown;
  caseDetailHelper: unknown;
};

export const ConsolidatedCases = connect(
  {
    caseDetail: props.caseDetail,
    caseDetailHelper: props.caseDetailHelper,
  },
  function ConsolidatedCases({
    caseDetail,
    caseDetailHelper,
  }: {
    caseDetail: {
      consolidatedCases: Array<{
        docketNumber: string;
        caseTitle?: string;
      }>;
    };
    caseDetailHelper: {
      hasConsolidatedCases: boolean;
    };
  }) {
    return (
      <>
        {!caseDetailHelper.hasConsolidatedCases && <p>Not consolidated</p>}
        <div className="grid-container padding-left-0 margin-bottom-2">
          {caseDetail.consolidatedCases.map(consolidatedCase => (
            <div
              className="grid-row margin-top-3 align-items-baseline"
              key={consolidatedCase.docketNumber}
            >
              <NonMobile>
                <div className="tablet:grid-col-3 desktop:grid-col-2">
                  <CaseLink formattedCase={consolidatedCase} />
                </div>
                <div className="tablet:grid-col-9 desktop:grid-col-10">
                  {consolidatedCase.caseTitle || 'Sealed Case'}
                </div>
              </NonMobile>
              <Mobile>
                <div className="grid-col-4">
                  <CaseLink formattedCase={consolidatedCase} />
                </div>
                <div className="grid-col-8 margin-left-neg-2">
                  {consolidatedCase.caseTitle}
                </div>
              </Mobile>
            </div>
          ))}
        </div>
      </>
    );
  },
);

ConsolidatedCases.displayName = 'ConsolidatedCases';
