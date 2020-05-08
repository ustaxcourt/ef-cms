const React = require('react');
const { mount, shallow } = require('enzyme');
const { ReceiptOfFiling } = require('./ReceiptOfFiling.jsx');

describe('ReceiptOfFiling', () => {
  let options;
  let documents;
  let filedAt;
  let filedBy;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Petitioner',
      docketNumberWithSuffix: '123-45S',
    };

    documents = [
      {
        documentTitle: 'Motion for a New Trial',
      },
    ];

    filedAt = '02/22/20 2:22am ET';
    filedBy = 'Mike Wazowski'; // You did it, buddy. You filed your paperwork.
  });

  it('renders a document header with case information', () => {
    const wrapper = mount(<ReceiptOfFiling options={options} />);

    expect(wrapper.find('#caption').text()).toContain(
      `${options.caseTitle}, ${options.caseCaptionExtension}`,
    );
    expect(wrapper.find('#docket-number').text()).toEqual(
      `Docket Number ${options.docketNumberWithSuffix}`,
    );
    expect(wrapper.find('.case-information h3').text()).toEqual(
      'Receipt of Filing',
    );
  });

  it('displays who made the filing', () => {
    const wrapper = shallow(
      <ReceiptOfFiling filedAt={filedAt} filedBy={filedBy} options={options} />,
    );

    expect(wrapper.find('#receipt-filed-by').text()).toEqual(
      `Filed by ${filedBy}`,
    );
    expect(wrapper.find('#receipt-filed-at').text()).toEqual(
      `Filed ${filedAt}`,
    );
  });

  it('displays a list of documents filed', () => {
    const wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    const documentEls = wrapper.find('.receipt-filed-document');

    expect(wrapper.find('.card .card-header').text()).toEqual(
      'Documents Filed',
    );
    expect(documentEls.length).toEqual(documents.length);
    expect(documentEls.at(0).find('.receipt-document-title').text()).toEqual(
      documents[0].documentTitle,
    );
  });

  it('displays the attachments label if the document has attachments', () => {
    documents[0].attachments = true;

    const wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    wrapper.find('.receipt-filed-document').at(0);

    expect(wrapper.find('h4.document-includes-header').text()).toEqual(
      'Document Includes',
    );
    expect(wrapper.find('p.included').text()).toEqual('Attachment(s)');
  });

  it('displays the certificate of service date if the document has a certificate of service', () => {
    documents[0].certificateOfService = true;
    documents[0].certificateOfServiceDate = '02/02/20';

    const wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    wrapper.find('.receipt-filed-document').at(0);

    expect(wrapper.find('h4.document-includes-header').text()).toEqual(
      'Document Includes',
    );
    expect(wrapper.find('p.included').text()).toEqual(
      `Certificate of Service ${documents[0].certificateOfServiceDate}`,
    );
  });

  it('displays objections for the document if present', () => {
    // No objections value set
    let wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    let documentEl = wrapper.find('.receipt-filed-document').at(0);

    expect(documentEl.find('.receipt-objections').length).toEqual(0);

    documents[0].objections = 'Some';

    wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
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
    documents[0].objections = 'No';

    const wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    const documentEl = wrapper.find('.receipt-filed-document').at(0);
    const objectionsEl = documentEl.find('p.receipt-objections');

    expect(objectionsEl.text()).toEqual(
      `${documents[0].objections} Objections`,
    );
  });

  it('adds some vertical space above objections content if attachments or certificate of service are present', () => {
    documents[0].attachments = true;
    documents[0].objections = 'No';

    let wrapper = shallow(
      <ReceiptOfFiling
        documents={documents}
        filedAt={filedAt}
        filedBy={filedBy}
        options={options}
      />,
    );

    const documentEl = wrapper.find('.receipt-filed-document').at(0);

    expect(documentEl.find('.receipt-objections br').length).toEqual(1);
  });
});
