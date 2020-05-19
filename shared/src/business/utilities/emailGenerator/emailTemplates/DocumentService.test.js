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

    expect(documentInfo.text()).toContain(documentDetail.documentTitle);
    expect(documentInfo.text()).toContain(
      `Docket Entry No.: ${docketEntryNumber}`,
    );
    expect(documentInfo.text()).toContain(documentDetail.servedAtFormatted);
    expect(documentInfo.text()).toContain(documentDetail.filedBy);
  });

  it('renders N/A if filedBy is not present on documentDetail', () => {
    const documentDetailWithoutFiledBy = {
      ...documentDetail,
      filedBy: undefined,
    };

    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetailWithoutFiledBy}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#document-information');

    expect(documentInfo.text()).toContain('Filed by: N/A');
  });

  it('renders computer-readable information if user name is IRS', () => {
    const wrapper = shallow(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#computer-readable');

    expect(documentInfo.text()).toContain('docketNumber');
  });
});
