import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

describe('headerHelper', () => {
  it('should show search in header for non-practitioners', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'taxpayer',
        },
      },
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });
  it('should show document qc for internal users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'seniorattorney',
        },
      },
    });
    expect(result1.showDocumentQC).toBeTruthy();
    expect(result2.showDocumentQC).toBeTruthy();
    expect(result3.showDocumentQC).toBeTruthy();
  });
  it('should show messages for internal users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'seniorattorney',
        },
      },
    });
    expect(result1.showMessages).toBeTruthy();
    expect(result2.showMessages).toBeTruthy();
    expect(result3.showMessages).toBeTruthy();
  });
  it('should show cases for external users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'respondent',
        },
      },
    });
    expect(result1.showMyCases).toBeTruthy();
    expect(result2.showMyCases).toBeTruthy();
    expect(result3.showMyCases).toBeTruthy();
  });
  it('should NOT show search in header for practitioners', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
  it('should NOT show document qc for external users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'respondent',
        },
      },
    });
    expect(result1.showDocumentQC).toBeFalsy();
    expect(result2.showDocumentQC).toBeFalsy();
    expect(result3.showDocumentQC).toBeFalsy();
  });
  it('should NOT show messages for external users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'respondent',
        },
      },
    });
    expect(result1.showMessages).toBeFalsy();
    expect(result2.showMessages).toBeFalsy();
    expect(result3.showMessages).toBeFalsy();
  });
  it('should NOT show cases for internal users', async () => {
    const result1 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = await runCompute(headerHelper, {
      state: {
        user: {
          role: 'seniorattorney',
        },
      },
    });
    expect(result1.showMyCases).toBeFalsy();
    expect(result2.showMyCases).toBeFalsy();
    expect(result3.showMyCases).toBeFalsy();
  });
  it('should know when the page is Messages', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        currentPage: 'DashboardPetitionsClerk',
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    expect(result.pageIsMessages).toBeTruthy();
  });
  it('should know when the page is My Cases', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        currentPage: 'DashboardPetitioner',
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.pageIsMyCases).toBeTruthy();
  });
});
