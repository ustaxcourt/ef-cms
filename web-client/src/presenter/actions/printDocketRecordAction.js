import { state } from 'cerebral';
import printDocketRecordTemplate from '../../views/DocketRecord/printDocketRecordTemplate.html';

/**
 * Prints the docket record
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.store the cerebral store object
 * @returns {object} the docket number and stringified docketRecordHtml
 */
export const printDocketRecordAction = ({ applicationContext, get }) => {
  const { ContactFactory } = applicationContext.getEntityConstructors();
  const caseDetail = get(state.formattedCaseDetail);
  const caseDetailHelper = get(state.caseDetailHelper);

  const ifTextContent = (content, contentDisplay) => {
    if (content && content !== '' && content != undefined) {
      return contentDisplay;
    } else {
      return '';
    }
  };

  const getPartyInfoContent = (detail, helper) => {
    let partyInfoContent = '';

    const getAddress = contact => {
      let content = '';

      content += ifTextContent(
        contact.inCareOf,
        '<div>c/o' + contact.inCareOf + '</div>',
      );
      content += ifTextContent(
        contact.title,
        '<div>' + contact.title + '</div>',
      );
      content += ifTextContent(
        contact.address1,
        '<div>' + contact.address1 + '</div>',
      );
      content += ifTextContent(
        contact.address2,
        '<div>' + contact.address2 + '</div>',
      );
      content += ifTextContent(
        contact.address3,
        '<div>' + contact.address3 + '</div>',
      );

      content += '<div>';
      content += ifTextContent(contact.city, contact.city + ', ');
      content +=
        ifTextContent(contact.state, contact.state) +
        ' ' +
        ifTextContent(contact.postalCode, contact.postalCode);
      content += '</div>';

      content +=
        contact.countryType === ContactFactory.COUNTRY_TYPES.INTERNATIONAL
          ? ifTextContent(contact.country, contact.country)
          : '';
      content += ifTextContent(contact.phone, '<p>' + contact.phone + '</p>');

      return content;
    };

    const {
      contactPrimary,
      contactSecondary,
      practitioners,
      respondents,
    } = detail;

    partyInfoContent +=
      '<div class="party-info"><div class="party-info-header">' +
      detail.partyType +
      '</div><div class="party-info-content">';
    // contactPrimary
    if (detail.contactPrimary) {
      const name = helper.showCaseNameForPrimary
        ? detail.caseName
        : contactPrimary.name;

      partyInfoContent += '<div class="party-details">';
      partyInfoContent += '<p>' + name + '</p>';
      partyInfoContent += getAddress(contactPrimary);
      partyInfoContent += '</div>';
    }

    // contactSecondary
    if (contactSecondary && contactSecondary.name) {
      partyInfoContent += '<div class="party-details">';
      partyInfoContent += '<p>' + contactSecondary.name + '</p>';
      partyInfoContent += getAddress(contactSecondary);
      partyInfoContent += '</div>';
    }
    partyInfoContent += '</div></div>';

    // practitioners
    if (practitioners.length > 0) {
      partyInfoContent +=
        '<div class="party-info"><div class="party-info-header">Petitioner Counsel</div><div class="party-info-content">';
      practitioners.map(practitioner => {
        if (practitioner.formattedName) {
          partyInfoContent += '<div class="party-details">';
          partyInfoContent += '<p>' + practitioner.formattedName + '</p>';
          partyInfoContent += getAddress({
            ...practitioner,
            address1: practitioner.addressLine1,
            address2: practitioner.addressLine2,
            address3: practitioner.addressLine3,
          });
          partyInfoContent += '<p><strong>Representing</strong><br/>';
          if (practitioner.representingPrimary) {
            partyInfoContent += detail.contactPrimary.name;
            if (practitioner.representingSecondary) {
              partyInfoContent += '<br/>';
            }
          }
          if (
            practitioner.representingSecondary &&
            detail.contactSecondary &&
            detail.contactSecondary.name
          ) {
            partyInfoContent += detail.contactSecondary.name;
          }
          partyInfoContent += '</p></div>';
        }
      });
      partyInfoContent += '</div></div>';
    }

    // respondents
    if (respondents.length > 0) {
      partyInfoContent +=
        '<div class="party-info"><div class="party-info-header">Respondent Counsel</div><div class="party-info-content">';
      respondents.map(respondent => {
        if (respondent.name) {
          partyInfoContent += '<div class="party-details">';
          partyInfoContent += '<p>' + respondent.name + '</p>';
          partyInfoContent += getAddress({
            ...respondent,
            address1: respondent.addressLine1,
            address2: respondent.addressLine2,
            address3: respondent.addressLine3,
          });
          partyInfoContent += '</div>';
        }
      });
      partyInfoContent += '</div></div>';
    }
    return partyInfoContent;
  };

  const getDocketRecordContent = detail => {
    let docketRecordContent =
      '<table><thead><tr><th>No.</th><th>Date</th><th>Event</th><th>Filings and Proceedings</th><th>Filed By</th><th>Action</th><th>Served</th><th>Parties</th></thead>';
    detail.docketRecordWithDocument.map(({ document, index, record }) => {
      let documentEventCode = '';
      let documentFiledBy = '';
      let documentDateServed = '';
      let documentServedPartiesCode = '';
      let recordDescription = '<strong>' + record.description + '</strong>';

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

      docketRecordContent += '<tr>';
      // No.
      docketRecordContent += '<td>' + index + '</td>';
      // Date
      docketRecordContent += '<td>' + recordCreatedAtFormatted + '</td>';
      // Event
      docketRecordContent += '<td>' + documentEventCode + '</td>';
      // Filings and Proceedings
      docketRecordContent += '<td>' + recordDescription + '</td>';
      // Filed By
      docketRecordContent += '<td>' + documentFiledBy + '</td>';
      // Action
      docketRecordContent += '<td>' + recordAction + '</td>';
      // Served
      docketRecordContent += '<td>' + documentDateServed + '</td>';
      // Parties
      docketRecordContent += '<td>' + documentServedPartiesCode + '</td>';
      docketRecordContent += '</tr>';
    });
    docketRecordContent += '</tbody></table>';
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

  const docketRecordHtml = replaceTemplate();
  return {
    docketNumber: caseDetail.docketNumberWithSuffix,
    docketRecordHtml,
  };
};
