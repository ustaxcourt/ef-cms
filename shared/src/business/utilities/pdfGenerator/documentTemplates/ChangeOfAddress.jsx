const React = require('react');
const { COUNTRY_TYPES } = require('../../../entities/EntityConstants.js');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

const renderTable = ({ data, label, options }) => {
  return (
    <table id={`contact_info_${label}`}>
      <thead>
        <tr>
          <th>{label} Contact Information</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {options.showOnlyPhoneChange && <td>{data.phone}</td>}
          {!options.showOnlyPhoneChange && (
            <td>
              {data.inCareOf && <div>c/o {data.inCareOf}</div>}
              <div>{data.address1}</div>
              <div>{data.address2}</div>
              <div>{data.address3}</div>
              <div>
                {data.city && <span>{data.city}, </span>}
                {data.state} {data.postalCode}
                {data.countryType !== COUNTRY_TYPES.DOMESTIC &&
                  data.country && <div>{data.country}</div>}
                {options.showAddressAndPhoneChange && (
                  <div className="extra-margin-top">{data.phone}</div>
                )}
              </div>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export const ChangeOfAddress = ({ name, newData, oldData, options }) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3={options.h3}
      />

      <p className="please-change">
        Please change the contact information for {name} on the records of the
        Court.
      </p>
      <div>
        {renderTable({ data: oldData, label: 'Old', options })}
        <br />
        {renderTable({ data: newData, label: 'New', options })}
      </div>
    </>
  );
};
