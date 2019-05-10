import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

describe('headerHelper', () => {
  it('should show search in header for non-practitioners', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'taxpayer',
        },
      },
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });
  it('should show document qc for internal users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
  it('should show messages for internal users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
  it('should show cases for external users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
  it('should NOT show search in header for practitioners', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
  it('should NOT show document qc for external users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
  it('should NOT show messages for external users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
  it('should NOT show cases for internal users', () => {
    const result1 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    const result2 = runCompute(headerHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    const result3 = runCompute(headerHelper, {
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
});
