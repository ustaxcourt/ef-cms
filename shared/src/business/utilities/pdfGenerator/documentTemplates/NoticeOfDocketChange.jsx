const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfDocketChange = ({
  docketEntryIndex,
  filingParties,
  filingsAndProceedings,
  options,
}) => {
  const showFilingsAndProceedingsChange =
    filingsAndProceedings &&
    filingsAndProceedings.before !== filingsAndProceedings.after;
  const showPartiesChange =
    filingParties && filingParties.before !== filingParties.after;

  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Notice of Docket Change"
      />

      <div className="card margin-top-80">
        <div className="card-header">
          Docket Entry No. {docketEntryIndex} has been changed
        </div>
        <div className="card-content">
          {showFilingsAndProceedingsChange && (
            <span id="changed-filings-and-proceedings">
              &quot;{filingsAndProceedings.before}&quot; has been changed to
              &quot;
              {filingsAndProceedings.after}&quot;.
            </span>
          )}
          {showPartiesChange && (
            <span id="changed-filing-parties">
              &quot;{filingParties.before}&quot; has been changed to &quot;
              {filingParties.after}
              &quot;.
            </span>
          )}
        </div>
      </div>

      <p className="float-right width-third">
        Stephanie A. Servoss
        <br />
        Clerk of the Court
      </p>
    </>
  );
};
