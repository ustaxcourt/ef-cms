import { state } from 'cerebral';
import printDocketRecordTemplate from '../../views/DocketRecord/printDocketRecordTemplate.html';

/**
 * Prints the docket record
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.store the cerebral store object
 * @returns {object} the docket number and stringified contentHtml
 */
export const printDocketRecordAction = ({ applicationContext, get }) => {
  const { ContactFactory } = applicationContext.getEntityConstructors();
  const caseDetail = get(state.formattedCaseDetail);
  const caseDetailHelper = get(state.caseDetailHelper);

  const getPartyInfoContent = (detail, helper) => {
    const {
      contactPrimary,
      contactSecondary,
      practitioners,
      respondents,
    } = detail;

    const getAddress = contact => {
      const isInternational =
        contact.countryType === ContactFactory.COUNTRY_TYPES.INTERNATIONAL;

      let content = `
        ${contact.inCareOf ? `<div>${contact.inCareOf}</div>` : ''}
        ${contact.title ? `<div>${contact.title}</div>` : ''}
        ${contact.address1 ? `<div>${contact.address1}</div>` : ''}
        ${contact.address2 ? `<div>${contact.address2}</div>` : ''}
        ${contact.address3 ? `<div>${contact.address3}</div>` : ''}
        <div>
          ${contact.city ? `${contact.city}, ` : ''}
          ${contact.state ? `${contact.state}, ` : ''}
          ${contact.postalCode ? `${contact.postalCode}, ` : ''}
        </div>
        ${isInternational ? contact.country : ''}
        ${contact.phone ? `<p>${contact.phone}</p>` : ''}
      `;

      return content;
    };

    const getContactPrimary = () => {
      const name = helper.showCaseNameForPrimary
        ? detail.caseName
        : contactPrimary.name;

      return `
        <div class="party-details">
          <p>${name}</p>
          ${getAddress(contactPrimary)}
        </div>
      `;
    };

    const getContactSecondary = () => `
      <div class="party-details">
        <p>${contactSecondary.name ? contactSecondary.name : ''}</p>
        ${getAddress(contactSecondary)}
      </div>
    `;

    let partyInfoContent = `
      <div class="party-info">
        <div class="party-info-header">${detail.partyType}</div>
        <div class="party-info-content">
          ${contactPrimary ? getContactPrimary() : ''}
          ${contactSecondary ? getContactSecondary() : ''}
        </div>
      </div>
    `;

    // practitioners
    if (practitioners.length > 0) {
      const getPractitioners = () => {
        let result = '';

        practitioners.map(practitioner => {
          if (practitioner.formattedName) {
            const { representingPrimary, representingSecondary } = practitioner;
            result += `
              <div class="party-details">
                <p>${practitioner.formattedName}</p>
                ${getAddress({
                  ...practitioner,
                  address1: practitioner.address1,
                  address2: practitioner.address2,
                  address3: practitioner.address3,
                })}
                <p>
                  <strong>Representing</strong>
                  <br />
                  ${representingPrimary ? contactPrimary.name : ''}
                  ${representingSecondary ? '<br />' : ''}
                  ${
                    representingSecondary &&
                    contactPrimary &&
                    contactPrimary.name
                      ? contactSecondary.name
                      : ''
                  }
                </p>
              </div>
            `;
          }
        });

        return result;
      };

      partyInfoContent += `
        <div class="party-info">
          <div class="party-info-header">Petitioner Counsel</div>
          <div class="party-info-content">
            ${getPractitioners()}
          </div>
        </div>
      `;
    }

    // respondents
    if (respondents.length > 0) {
      const getRespondents = () => {
        let result = '';

        respondents.map(respondent => {
          if (respondent.name) {
            result += `
              <div class="party-details">
                <p>${respondent.name}</p>
                ${getAddress({
                  ...respondent,
                  address1: respondent.address1,
                  address2: respondent.address2,
                  address3: respondent.address3,
                })}
              </div>
            `;
          }
        });

        return result;
      };

      partyInfoContent += `
        <div class="party-info">
          <div class="party-info-header">Respondent Counsel</div>
          <div class="party-info-content">
            ${getRespondents()}
          </div>
        </div>
      `;
    }

    return partyInfoContent;
  };

  const getDocketRecordContent = detail => {
    let docketRecordContent = `
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Event</th>
            <th>Filings and Proceedings</th>
            <th>Filed By</th>
            <th>Action</th>
            <th>Served</th>
            <th>Parties</th>
          </tr>
        </thead>
        <tbody>
    `;

    detail.docketRecordWithDocument.map(({ document, index, record }) => {
      let documentEventCode = '';
      let documentFiledBy = '';
      let documentDateServed = '';
      let documentServedPartiesCode = '';
      let recordDescription = `<strong>${record.description}</strong>`;

      if (record.filingsAndProceedings) {
        recordDescription += ' ' + record.filingsAndProceedings;
      }

      const recordCreatedAtFormatted = record.createdAtFormatted;
      const recordAction = record.action || '';

      if (document) {
        documentEventCode = document.eventCode || '';
        documentFiledBy = document.filedBy || '';
        documentServedPartiesCode = document.servedPartiesCode || '';

        if (document.isStatusServed) {
          documentDateServed = document.servedAtFormatted || '';
        }

        if (document.additionalInfo2) {
          recordDescription += ' ' + document.additionalInfo2;
        }
      }

      if (documentDateServed) {
        const arrDateServed = documentDateServed.split(' ');
        documentDateServed = `${
          arrDateServed[0]
        } <span class="no-wrap">${arrDateServed.slice(1).join(' ')}</span>`;
      }

      docketRecordContent += `
        <tr>
          <td>${index}</td>
          <td>${recordCreatedAtFormatted}</td>
          <td>${documentEventCode}</td>
          <td>${recordDescription}</td>
          <td>${documentFiledBy}</td>
          <td>${recordAction}</td>
          <td>${documentDateServed}</td>
          <td>${documentServedPartiesCode}</td>
        </tr>
      `;
    });

    docketRecordContent += `
      </tbody>
    </table>
    `;

    return docketRecordContent;
  };

  const replaceTemplate = () => {
    let output = printDocketRecordTemplate;
    // caption
    output = output.replace(/{{ caption }}/g, caseDetail.caseCaption);
    // captionPostfix
    output = output.replace(
      /{{ captionPostfix }}/g,
      caseDetailHelper.caseCaptionPostfix,
    );
    // docketNumber
    output = output.replace(
      /{{ docketNumber }}/g,
      caseDetail.docketNumberWithSuffix,
    );
    // partyInfo
    output = output.replace(
      /{{ partyInfo }}/g,
      getPartyInfoContent(caseDetail, caseDetailHelper),
    );
    // docketRecord
    output = output.replace(
      /{{ docketRecord }}/g,
      getDocketRecordContent(caseDetail),
    );
    return output;
  };

  const contentHtml = replaceTemplate();
  return {
    contentHtml,
    docketNumber: caseDetail.docketNumberWithSuffix,
  };
};
