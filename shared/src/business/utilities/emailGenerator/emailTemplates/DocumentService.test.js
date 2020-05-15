const React = require('react');
const { DocumentService } = require('./DocumentService.jsx');
const { shallow } = require('enzyme');

describe('DocumentService', () => {
  const caseDetail = {
    caseTitle: 'Test Case Title',
    docketNumber: '123-45',
  };
  const docketEntryNumber = 1;
  const documentDetail = {
    documentTitle: 'Answer',
    eventCode: 'A',
    filedBy: 'Petr. Guy Fieri',
    servedAtFormatted: '02/03/2020 12:00am EST',
  };
  const taxCourtLoginUrl = 'http://example.com/login';

  it('renders case information', () => {
    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );

    const caseInfo = wrapper.find('#case-information');

    expect(caseInfo.text()).toContain(caseDetail.docketNumber);
    expect(caseInfo.text()).toContain(caseDetail.caseTitle);
  });

  it('renders document information', () => {
    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#document-information');

    expect(documentInfo.text()).toContain(documentDetail.eventCode);
    expect(documentInfo.text()).toContain(documentDetail.documentTitle);
    expect(documentInfo.text()).toContain(
      `Docket Entry No.: ${docketEntryNumber}`,
    );
    expect(documentInfo.text()).toContain(documentDetail.servedAtFormatted);
    expect(documentInfo.text()).toContain(documentDetail.filedBy);
  });

  it('renders IRS information if user name is IRS', () => {
    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        name="IRS"
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#irs-information');

    expect(documentInfo.text()).toContain('For IRS only');
  });

  it('does not render IRS information if user name is not IRS', () => {
    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        name="Guy Fieri"
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#irs-information');

    expect(documentInfo).toEqual({});
  });
});
