import { CaseLink } from '../../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const ConsolidatedCases = connect(
  {
    caseDetail: props.caseDetail,
    caseDetailHelper: props.caseDetailHelper,
  },
  function ConsolidatedCases({ caseDetail, caseDetailHelper }) {
    return (
      <>
        {!caseDetailHelper.hasConsolidatedCases && <p>Not consolidated</p>}
        <div className="grid-container padding-left-0">
          {caseDetail.consolidatedCases.map(consolidatedCase => (
            <div
              className="grid-row margin-top-3"
              key={consolidatedCase.docketNumber}
            >
              <div className="grid-col-2">
                <CaseLink formattedCase={consolidatedCase} />
              </div>
              <div className="grid-col-10">{consolidatedCase.caseTitle}</div>
            </div>
          ))}
        </div>
      </>
    );
  },
);
