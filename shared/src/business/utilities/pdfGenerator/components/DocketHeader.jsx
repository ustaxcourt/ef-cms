const React = require('react');

const DocketHeader = ({ caption, docketNumberWithSuffix, h3 }) => {
  return (
    <>
      <div className="case-information">
        <div id="caption">
          <div id="caption-title">{caption}</div>
          <div id="caption-petitioners">Petitioner(s)</div>
          <div id="caption-v">v.</div>
          <div id="caption-commissioner">Commissioner of Internal Revenue</div>
          <div id="caption-respondent">Respondent</div>
        </div>
        <div id="docket-number">Docket Number {docketNumberWithSuffix}</div>
        <div className="clear"></div>
        {h3 && <h3>{h3}</h3>}
      </div>
    </>
  );
};

export default DocketHeader;
