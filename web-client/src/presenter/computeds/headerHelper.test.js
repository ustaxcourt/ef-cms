import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

const getState = role => {
  return {
    notifications: {
      unreadCount: 0,
    },
    user: {
      role,
    },
  };
};

const interal = ['petitionsclerk', 'seniorattorney', 'docketclerk'];
const external = ['petitioner', 'practitioner', 'respondent'];

describe('headerHelper', () => {
  it('should show search in header for users other than practitioners and respondents', () => {
    let result = runCompute(headerHelper, {
      state: getState('taxpayer'),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getState('petitionsclerk'),
    });
    expect(result.showSearchInHeader).toBeTruthy();

    result = runCompute(headerHelper, {
      state: getState('docketclerk'),
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });

  it('should show document qc for internal users', () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showDocumentQC).toBeTruthy();
    });
  });
  it('should show messages for internal users', () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMessages).toBeTruthy();
    });
  });
  it('should show trial sessions for internal users', () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showTrialSessions).toBeTruthy();
    });
  });
  it('should show cases for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMyCases).toBeTruthy();
    });
  });
  it('should NOT show search in header for practitioners or respondents', () => {
    let result = runCompute(headerHelper, {
      state: getState('practitioner'),
    });
    expect(result.showSearchInHeader).toBeFalsy();

    result = runCompute(headerHelper, {
      state: getState('respondent'),
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
  it('should NOT show document qc for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showDocumentQC).toBeFalsy();
    });
  });
  it('should NOT show trial sessions for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showTrialSessions).toBeFalsy();
    });
  });
  it('should NOT show messages for external users', () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMessages).toBeFalsy();
    });
  });
  it('should NOT show cases for internal users', () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMyCases).toBeFalsy();
    });
  });
  it('should know when the page is Messages', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'Messages',
        workQueueToDisplay: {
          workQueueIsInternal: true,
        },
      },
    });
    console.log(JSON.stringify(result));
    expect(result.pageIsMessages).toBeTruthy();
  });
  it('should know when the page is My Cases', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitioner'),
        currentPage: 'DashboardPetitioner',
      },
    });
    expect(result.pageIsMyCases).toBeTruthy();
  });
  it('should not set pageIsMessages or pageIsDocumentQC to true if currentPage is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsMyCases).toBeFalsy();
    expect(result.pageIsDocumentQC).toBeFalsy();
  });
  it('should know when the page is TrialSessions', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });
  it('should know when the page is TrialSessionDetails', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'TrialSessionDetails',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });

  it('should show border under Reports tab when page is CaseDeadlines', () => {
    const result = runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'CaseDeadlines',
      },
    });
    expect(result.pageIsReports).toBeTruthy();
  });
});
