import { generateHTMLTemplateForPDF } from './index';

/**
 * HTML template generator for printable change of address/telephone PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateChangeOfAddressTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    documentTitle,
    name,
    newData,
    oldData,
  } = content;

  let oldAddress = '';
  let newAddress = '';

  if (documentTitle === 'Notice of Change of Telephone Number') {
    oldAddress = `<div>${oldData.phone}</div>`;
    newAddress = `<div>${newData.phone}</div>`;
  } else {
    if (oldData.inCareOf) {
      oldAddress += `<div>c/o ${oldData.inCareOf}</div>`;
    }

    if (newData.inCareOf) {
      newAddress += `<div>c/o ${newData.inCareOf}</div>`;
    }

    oldAddress += `<div>${oldData.address1}</div>`;
    newAddress += `<div>${newData.address1}</div>`;

    if (oldData.address2) {
      oldAddress += `<div>${oldData.address2}</div>`;
    }

    if (newData.address2) {
      newAddress += `<div>${newData.address2}</div>`;
    }

    if (oldData.address3) {
      oldAddress += `<div>${oldData.address3}</div>`;
    }

    if (newData.address3) {
      newAddress += `<div>${newData.address3}</div>`;
    }

    oldAddress += `<div>${oldData.city}, ${oldData.state} ${oldData.postalCode}</div>`;
    newAddress += `<div>${newData.city}, ${newData.state} ${newData.postalCode}</div>`;

    if (oldData.country) {
      oldAddress += `<div>${oldData.country}</div>`;
    }

    if (newData.country) {
      newAddress += `<div>${newData.country}</div>`;
    }

    if (documentTitle === 'Notice of Change of Address and Telephone Number') {
      oldAddress += `<div style="margin-top:8px;">${oldData.phone}</div>`;
      newAddress += `<div style="margin-top:8px;">${newData.phone}</div>`;
    }
  }

  const main = `
    <p class="please-change">
      Please change the contact information for ${name} on the records of the Court.
    </p>
    <div>
      <table>
        <thead>
          <tr>
            <th>Old Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${oldAddress}
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
      <table>
        <thead>
          <tr>
            <th>New Contact Information</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${newAddress}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const styles = `
    .please-change {
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    th, td {
      font-size: 10px;
    }
    th {
      font-weight: 600;
    }
    .case-information #caption {
      line-height:18px;
    }
  `;

  const templateContent = {
    caption,
    captionPostfix,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
    styles,
    title: 'Change of Contact Information',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = {
  generateChangeOfAddressTemplate,
};
