import { runCompute } from 'cerebral/test';

import { formatYearAmounts, formattedCaseDetail } from './formattedCaseDetail';
import { CASE_CAPTION_POSTFIX } from '../../../../shared/src/business/entities/Case';

describe('formatYearAmounts', () => {
  it('does not return 2018 when a blank string is passed in', () => {
    const caseDetail = {
      yearAmounts: [
        {
          amount: '',
          year: '2000',
        },
        {
          amount: '',
          year: '',
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
          amount: '',
          year: '2000',
        },
        {
          amount: '',
          year: '5000-12-24T00:00:00.000Z',
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
          amount: '1000',
          year: '2000',
        },
        {
          amount: '1337',
          year: '2000-12-24T00:00:00.000Z',
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
        amountFormatted: '1,337',
        errorMessage: 'Duplicate years are bad',
        formattedYear: '2000',
        showError: true,
        year: '2000',
      },
    ]);
  });

  it('sets shouldShowIrsNoticeDate to true when hasIrsNotice is true and hasVerifiedIrsNotice is undefined', async () => {
    const caseDetail = {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: undefined,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.shouldShowIrsNoticeDate).toBeTruthy();
  });

  it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to true when hasIrsNotice is true and hasVerifiedIrsNotice is true', async () => {
    const caseDetail = {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: true,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.shouldShowIrsNoticeDate).toBeTruthy();
    expect(result.shouldShowYearAmounts).toBeTruthy();
  });

  it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to false when hasIrsNotice is false and hasVerifiedIrsNotice is undefined', async () => {
    const caseDetail = {
      hasIrsNotice: false,
      hasVerifiedIrsNotice: undefined,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.shouldShowIrsNoticeDate).toBeFalsy();
    expect(result.shouldShowYearAmounts).toBeFalsy();
  });

  it('sets shouldShowIrsNoticeDate and shouldShowYearAmounts to false when hasIrsNotice is false and hasVerifiedIrsNotice is false', async () => {
    const caseDetail = {
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.shouldShowIrsNoticeDate).toBeFalsy();
    expect(result.shouldShowYearAmounts).toBeFalsy();
  });

  it('maps docket record dates', async () => {
    const caseDetail = {
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.docketRecord[0].createdAtFormatted).toEqual('02/28/2019');
  });

  it('maps docket record documents', async () => {
    const caseDetail = {
      docketRecord: [
        {
          description: 'Petition',
          documentId: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
      documents: [
        {
          createdAt: '2019-02-28T21:14:39.488Z',
          documentId: 'Petition',
          documentType: 'Petition',
          showValidationInput: '2019-02-28T21:14:39.488Z',
          status: 'served',
        },
      ],
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.docketRecordWithDocument[0].document.documentId).toEqual(
      'Petition',
    );
  });

  it('maps case name', async () => {
    const caseDetail = {
      caseTitle:
        'Sisqo, Petitioner v. Commissioner of Internal Revenue, Respondent',
      docketRecord: [
        {
          description: 'Petition',
          documentId: 'Petition',
          filedBy: 'Jessica Frase Marine',
          filingDate: '2019-02-28T21:14:39.488Z',
        },
      ],
      documents: [
        {
          createdAt: '2019-02-28T21:14:39.488Z',
          documentId: 'Petition',
          documentType: 'Petition',
          showValidationInput: '2019-02-28T21:14:39.488Z',
          status: 'served',
        },
      ],
      hasIrsNotice: false,
      hasVerifiedIrsNotice: false,
      petitioners: [{ name: 'bob' }],
    };
    const result = await runCompute(formattedCaseDetail, {
      state: {
        caseDetail,
        caseDetailErrors: {},
        constants: {
          CASE_CAPTION_POSTFIX,
        },
      },
    });
    expect(result.caseName).toEqual('Sisqo');
  });
});
