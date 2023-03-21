const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.tsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.tsx');

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
    <div id="notice-of-docket-change">
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        documentTitle="Notice of Docket Change"
      />

      <div className="card margin-top-80">
        <div className="card-header">
          Docket Entry No. {docketEntryIndex} has been changed
        </div>
        <div className="card-content">
          {showFilingsAndProceedingsChange && (
            <div
              className="internal-card-content"
              id="changed-filings-and-proceedings"
            >
              &quot;{filingsAndProceedings.before}&quot; has been changed to
              &quot;
              {filingsAndProceedings.after}&quot;.
            </div>
          )}
          {showPartiesChange && (
            <div className="internal-card-content" id="changed-filing-parties">
              The filing party/parties has been changed from &quot;
              {filingParties.before}&quot; to &quot;
              {filingParties.after}
              &quot;.
            </div>
          )}
        </div>
      </div>

      <p className="float-right width-third">
        Stephanie A. Servoss
        <br />
        Clerk of the Court
      </p>
    </div>
  );
};
