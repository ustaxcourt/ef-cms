import { runCompute } from 'cerebral/test';

import { formattedCaseDetail, formatYearAmounts } from './formattedCaseDetail';

describe('formattedCaseDetail', () => {
  it('should convert the status to general docket when it is general', async () => {
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          status: 'general',
        },
      },
    });
    expect(result.status).toEqual('general docket');
  });
});

describe('formatYearAmounts', () => {
  it('does not return 2018 when a blank string is passed in', () => {
    const caseDetail = {
      yearAmounts: [
        {
          year: '2000',
          amount: '',
        },
        {
          year: '',
          amount: '',
        },
      ],
    };
    formatYearAmounts(caseDetail);
    expect(caseDetail.yearAmountsFormatted).toEqual([
      {
        amount: '',
        amountFormatted: '',
        formattedYear: '2000',
        showError: false,
        year: '2000',
      },
      {
        amount: '',
        amountFormatted: '',
        formattedYear: 'Invalid date',
        showError: false,
        year: '',
      },
    ]);
  });

  it('returns the yearAmount that has year 5000 as an error', () => {
    const caseDetail = {
      yearAmounts: [
        {
          year: '2000',
          amount: '',
        },
        {
          year: '5000-12-24T00:00:00.000Z',
          amount: '',
        },
      ],
    };
    const caseDetailErrors = {
      yearAmounts: [{ index: 1, year: 'year can not be in future' }],
    };
    formatYearAmounts(caseDetail, caseDetailErrors);
    expect(caseDetail.yearAmountsFormatted).toEqual([
      {
        amount: '',
        amountFormatted: '',
        formattedYear: '2000',
        showError: false,
        year: '2000',
      },
      {
        amount: '',
        amountFormatted: '',
        errorMessage: 'year can not be in future',
        formattedYear: '5000',
        showError: true,
        year: '5000',
      },
    ]);
  });

  it('returns duplication errors for the second year Amount on duplicates', () => {
    const caseDetail = {
      yearAmounts: [
        {
          year: '2000',
          amount: '1000',
        },
        {
          year: '2000-12-24T00:00:00.000Z',
          amount: '1337',
        },
      ],
    };
    const caseDetailErrors = {
      yearAmounts: 'Duplicate years are bad',
    };
    formatYearAmounts(caseDetail, caseDetailErrors);
    expect(caseDetail.yearAmountsFormatted).toEqual([
      {
        amount: '1000',
        amountFormatted: '1,000',
        formattedYear: '2000',
        showError: false,
        year: '2000',
      },
      {
        amount: '1337',
        errorMessage: 'Duplicate years are bad',
        amountFormatted: '1,337',
        formattedYear: '2000',
        showError: true,
        year: '2000',
      },
    ]);
  });
});
