const React = require('react');

const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfDocketChange = ({
  docketEntryIndex,
  filingParties,
  filingsAndProceedings,
  options,
}) => {
  const showFilingsAndProceedingsChange =
    filingsAndProceedings.before !== filingsAndProceedings.after;
  const showPartiesChange = filingParties.before !== filingParties.after;

  return (
    <>
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Notice of Docket Change"
      />

      <div className="card margin-top-80">
        <div className="card-header">
          Docket Entry No. {docketEntryIndex} has been changed
        </div>
        {showFilingsAndProceedingsChange && (
          <p id="changed-filings-and-proceedings">
            &quot;{filingsAndProceedings.before}&quot; has been changed to
            &quot;
            {filingsAndProceedings.after}&quot;.
          </p>
        )}
        {showPartiesChange && (
          <p id="changed-filing-parties">
            &quot;{filingParties.before}&quot; has been changed to &quot;
            {filingParties.after}
            &quot;.
          </p>
        )}
        <p className="float-right width-third">
          Stephanie A. Servoss
          <br />
          Clerk of the Court
        </p>
      </div>
    </>
  );
};
