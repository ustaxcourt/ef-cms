const React = require('react');

const PDFDocumentHeader = require('../components/PDFDocumentHeader.jsx')
  .default;

const renderTable = ({ data, label, options }) => {
  return (
    <table>
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
                {data.city && <span>{data.city},</span>}
                {data.state} {data.postalCode}
                {data.country && <div>{data.country}</div>}
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

const ChangeOfAddress = ({ name, newData, oldData, options }) => {
  return (
    <>
      <PDFDocumentHeader
        caseCaptionWithPostfix={options.caseCaptionWithPostfix}
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

export default ChangeOfAddress;
