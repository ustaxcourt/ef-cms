const {
  validateCaseDetailInteractor,
} = require('./validateCaseDetailInteractor');

describe('validate case detail', () => {
  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {},
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: 'Docket number is required',
    });
  });

  it('does not return an error if that field is valid', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {
        caseTitle: 'A case title',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: 'Docket number is required',
    });
  });

  it('returns no errors if the case validates', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {
        hasIrsNotice: true,
        irsNoticeDate: 'aa',
        payGovDate: '12',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
    expect(errors.payGovDate).toBeTruthy();
  });

  it('returns no errors on valid amounts and years', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns no errors on null irsNoticeDate', () => {
    const errors = validateCaseDetailInteractor({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: false,
        irsNoticeDate: null,
        partyType: 'Petitioner',
        payGovDate: '2018-12-24T00:00:00.000Z',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });
});
