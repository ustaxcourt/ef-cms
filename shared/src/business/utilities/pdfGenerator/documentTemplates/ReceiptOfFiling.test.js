const React = require('react');
const { mount, shallow } = require('enzyme');
const { OBJECTIONS_OPTIONS_MAP } = require('../../../entities/EntityConstants');
const { ReceiptOfFiling } = require('./ReceiptOfFiling.jsx');

describe('ReceiptOfFiling', () => {
  let options;
  let document;
  let filedAt;
  let filedBy;
  let supportingDocuments;
  let secondaryDocument;
  let secondarySupportingDocuments;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    document = {
      documentTitle: 'Motion for a New Trial',
    };

    supportingDocuments = [
      {
        documentTitle: 'Supporting Document One Title',
      },
      {
        documentTitle: 'Supporting Document Two Title',
      },
    ];

    secondaryDocument = {
      documentTitle: 'Secondary Document Title',
    };

    secondarySupportingDocuments = [
      {
        documentTitle: 'Secondary Supporting Document One Title',
      },
      {
        documentTitle: 'Secondary Supporting Document Two Title',
      },
    ];

    filedAt = '02/22/20 2:22am ET';
    filedBy = 'Mike Wazowski'; // You did it, buddy. You filed your paperwork.
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(
      <ReceiptOfFiling document={document} options={options} />,
    );

    expect(wrapper.find('#caption').text()).toContain(
      `${options.caseTitle}, ${options.caseCaptionExtension}`,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket No. ${options.docketNumberWithSuffix}`,
    );
    expect(wrapper.find('.case-information h3').text()).toEqual(
      'Receipt of Filing',
    );
  });

  it('displays who made the filing', () => {
    const wrapper = shallow(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    expect(wrapper.find('#receipt-filed-by').text()).toEqual(
      `Filed by ${filedBy}`,
    );
    expect(wrapper.find('#receipt-filed-at').text()).toEqual(
      `Filed ${filedAt}`,
    );
  });

  it('displays a table with the documents that were filed', () => {
    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    const documentEls = wrapper.find('.receipt-filed-document');

    expect(wrapper.find('table thead tr th').at(0).text()).toEqual(
      'Documents Filed',
    );
    expect(wrapper.find('table thead tr th').at(1).text()).toEqual(
      'Document Includes',
    );

    expect(documentEls.length).toEqual(1);
    expect(documentEls.at(0).find('.receipt-document-title').text()).toEqual(
      document.documentTitle,
    );
  });

  it('displays the supporting documents filed if present', () => {
    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
        supportingDocuments={supportingDocuments}
      />,
    );

    const documentEls = wrapper.find('.receipt-filed-document');

    expect(documentEls.length).toEqual(1 + supportingDocuments.length);
    expect(documentEls.at(0).find('.receipt-document-title').text()).toEqual(
      document.documentTitle,
    );
    expect(documentEls.at(1).find('.receipt-document-title').text()).toEqual(
      supportingDocuments[0].documentTitle,
    );
    expect(documentEls.at(2).find('.receipt-document-title').text()).toEqual(
      supportingDocuments[1].documentTitle,
    );
  });

  it('displays the secondary document filed if present', () => {
    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
        secondaryDocument={secondaryDocument}
      />,
    );

    const documentEls = wrapper.find('.receipt-filed-document');

    expect(documentEls.length).toEqual(2);
    expect(documentEls.at(0).find('.receipt-document-title').text()).toEqual(
      document.documentTitle,
    );
    expect(documentEls.at(1).find('.receipt-document-title').text()).toEqual(
      secondaryDocument.documentTitle,
    );
  });

  it('displays the secondary supporting documents filed if present', () => {
    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
        secondaryDocument={secondaryDocument}
        secondarySupportingDocuments={secondarySupportingDocuments}
      />,
    );

    const documentEls = wrapper.find('.receipt-filed-document');

    expect(documentEls.length).toEqual(2 + secondarySupportingDocuments.length);
    expect(documentEls.at(0).find('.receipt-document-title').text()).toEqual(
      document.documentTitle,
    );
    expect(documentEls.at(1).find('.receipt-document-title').text()).toEqual(
      secondaryDocument.documentTitle,
    );
    expect(documentEls.at(2).find('.receipt-document-title').text()).toEqual(
      secondarySupportingDocuments[0].documentTitle,
    );
    expect(documentEls.at(3).find('.receipt-document-title').text()).toEqual(
      secondarySupportingDocuments[1].documentTitle,
    );
  });

  it('displays the attachments label if the document has attachments', () => {
    document.attachments = true;

    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    wrapper.find('.receipt-filed-document').at(0);
    expect(wrapper.find('p.included').text()).toEqual('Attachment(s)');
  });

  it('displays the formatted certificate of service date if the document has a certificate of service', () => {
    document.certificateOfService = true;
    document.formattedCertificateOfServiceDate = '02/02/20';

    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    wrapper.find('.receipt-filed-document').at(0);

    expect(wrapper.find('p.included').text()).toEqual(
      `Certificate of Service ${document.formattedCertificateOfServiceDate}`,
    );
  });

  it('displays objections for the document if present', () => {
    // No objections value set
    let wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    let documentEl = wrapper.find('.receipt-filed-document').at(0);

    expect(documentEl.find('.receipt-objections').length).toEqual(0);

    document.objections = 'Some';

    wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    documentEl = wrapper.find('.receipt-filed-document').at(0);
    let objectionsEl = documentEl.find('p.receipt-objections');

    expect(objectionsEl.length).toEqual(1);
    expect(objectionsEl.text()).toEqual('Objections');
  });

  it('displays the value of objections if it is either No or Unknown', () => {
    document.objections = OBJECTIONS_OPTIONS_MAP.NO;

    const wrapper = mount(
      <ReceiptOfFiling
        document={document}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    const documentEl = wrapper.find('.receipt-filed-document').at(0);
    const objectionsEl = documentEl.find('p.receipt-objections');

    expect(objectionsEl.text()).toEqual(`${document.objections} Objections`);
  });
});
