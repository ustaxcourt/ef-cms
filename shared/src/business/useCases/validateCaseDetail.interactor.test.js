const { validateCaseDetail } = require('./validateCaseDetail.interactor');

describe('validate case detail', () => {
  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetail({
      caseDetail: {},
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      caseTitle: 'A case title is required.',
      caseType: 'Case Type is required.',
      docketNumber: 'Docket number is required.',
      documents: 'At least one valid document is required.',
      preferredTrialCity: 'Preferred Trial City is required.',
      procedureType: 'Procedure Type is required.',
    });
  });

  it('does not return an error if that field is valid', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseTitle: 'A case title',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      caseType: 'Case Type is required.',
      docketNumber: 'Docket number is required.',
      documents: 'At least one valid document is required.',
      preferredTrialCity: 'Preferred Trial City is required.',
      procedureType: 'Procedure Type is required.',
    });
  });

  it('returns no errors if the case validates', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        procedureType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            createdAt: '2018-11-21T20:49:28.192Z',
            userId: 'taxpayer',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            workItems: [],
          },
        ],
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'defined',
        irsNoticeDate: new Date().toISOString(),
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        irsNoticeDate: 'aa',
        payGovDate: '12',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
    expect(errors.payGovDate).toBeTruthy();
  });

});
