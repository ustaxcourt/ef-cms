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

  it('returns an error if yearAmounts is missing a required value', () => {
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
        irsNoticeDate: new Date().toISOString(),
        signature: true,
        yearAmounts: [
          {
            amount: '123',
          },
          {
            year: '1236',
          },
          {
            year: '1234',
            amount: '1000',
          },
          {
            year: '2100',
            amount: '1000',
          },
        ],
      },
    });
    expect(errors.preferredTrialCity).toEqual(
      'Preferred Trial City is required.',
    );
    const yearAmount0 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 0,
    );
    const yearAmount1 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 1,
    );
    const yearAmount3 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 3,
    );
    expect(yearAmount0.year).toEqual('Please enter a valid year.');
    expect(yearAmount0.amount).toBeUndefined();
    expect(yearAmount1.amount).toEqual('Please enter a valid amount.');
    expect(yearAmount1.year).toBeUndefined();
    expect(yearAmount3.year).toEqual(
      'That year is in the future. Please enter a valid year.',
    );
  });

  it('returns an error if yearAmounts have duplicate years', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        procedureType: 'defined',
        docketNumber: '101-18',
        preferredTrialCity: 'Chattanooga, TN',
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
        irsNoticeDate: new Date().toISOString(),
        signature: true,
        yearAmounts: [
          {
            year: '2000',
            amount: '123',
          },
          {
            year: '2000',
            amount: '123',
          },
        ],
      },
    });
    expect(errors).toEqual({
      yearAmounts: 'Duplicate years are not allowed',
    });
  });
});
