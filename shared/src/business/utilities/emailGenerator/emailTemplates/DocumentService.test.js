const React = require('react');
const { DocumentService } = require('./DocumentService.jsx');
const { queryByAttribute, render, within } = require('@testing-library/react');

describe('DocumentService', () => {
  const caseDetail = {
    caseTitle: 'Test Case Title',
    docketNumber: '123-45',
    docketNumberWithSuffix: '123-45L',
  };
  const docketEntryNumber = 1;
  const documentDetail = {
    documentTitle: 'Answer',
    eventCode: 'A',
    filedBy: 'Petr. Guy Fieri',
    servedAtFormatted: '02/03/2020 12:00am EST',
  };
  const taxCourtLoginUrl = 'http://example.com/login';

  const getById = queryByAttribute.bind(null, 'id');

  it('renders case information', () => {
    const { container } = render(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );

    const caseInfo = getById(container, 'case-information');

    expect(
      within(caseInfo).getByText(caseDetail.docketNumber, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(caseInfo).getByText(caseDetail.caseTitle, { exact: false }),
    ).toBeInTheDocument();
  });

  it('renders document information', () => {
    const { container } = render(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = getById(container, 'document-information');

    expect(
      within(documentInfo).getByText(documentDetail.documentTitle, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(documentInfo).queryByText(docketEntryNumber, {
        exact: false,
      }),
    ).toBe(`Docket Entry No.: ${docketEntryNumber}`);
    expect(
      within(documentInfo).getByText(documentDetail.servedAtFormatted, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      within(documentInfo).getByText(documentDetail.filedBy, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it.skip('renders N/A if filedBy is not present on documentDetail', () => {
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

  it.skip('renders computer-readable information if user name is IRS', () => {
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
    expect(documentInfo.text()).not.toContain(
      caseDetail.docketNumberWithSuffix,
    );
  });
});
