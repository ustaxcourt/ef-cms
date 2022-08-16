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

  it('should render case information', () => {
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

  it('should render document information', () => {
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
      within(documentInfo).queryAllByText(docketEntryNumber, { exact: false })
        .length,
    ).toBe(2);
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

  it('should render N/A if filedBy is not present on documentDetail', () => {
    const documentDetailWithoutFiledBy = {
      ...documentDetail,
      filedBy: undefined,
    };

    const { container } = render(
      <DocumentService
        caseDetail={caseDetail}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetailWithoutFiledBy}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );

    const documentInfo = getById(container, 'document-information');

    expect(within(documentInfo).getByText('Filed by: N/A')).toBeInTheDocument();
  });

  it.skip('should render computer-readable information if user name is IRS', () => {
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

    // const { container } = render(
    //   <DocumentService
    //     caseDetail={caseDetail}
    //     docketEntryNumber={docketEntryNumber}
    //     documentDetail={documentDetail}
    //     taxCourtLoginUrl={taxCourtLoginUrl}
    //   />,
    // );

    // expect(within(container).getByText('docketNumber')).toBeInTheDocument();
    // expect(
    //   within(container).queryByText(caseDetail.docketNumberWithSuffix, {
    //     exact: false,
    //   }),
    // ).not.toBeInTheDocument();
  });
});
