const React = require('react');
const { DocumentService } = require('./DocumentService.jsx');
const { shallow } = require('enzyme');

describe('DocumentService', () => {
  it('renders the expected fields', () => {
    const wrapper = shallow(
      <DocumentService
        caseCaption="A Case Caption"
        docketNumber="101-19P"
        documentName="Petition"
        loginUrl="http://example.com"
        name="Bob James"
        serviceDate="01/01/2020"
        serviceTime="10:10pm"
      />,
    );

    const documentService = wrapper.find('.document-service');

    expect(documentService.text()).toContain('Bob James');
    expect(documentService.text()).toContain('101-19P');
    expect(documentService.text()).toContain('A Case Caption');
    expect(documentService.text()).toContain('Petition');
    expect(documentService.text()).toContain('01/01/2020');
    expect(documentService.text()).toContain('10:10pm');
    expect(wrapper.find(`a[href="${'http://example.com'}"]`).length).toEqual(1);
  });
});
