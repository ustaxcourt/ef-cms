import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

function getState(role) {
  return {
    notifications: {
      unreadCount: 0,
    },
    user: {
      role,
    },
  };
}

const interal = ['petitionsclerk', 'seniorattorney', 'docketclerk'];
const external = ['petitioner', 'practitioner', 'respondent'];

describe('headerHelper', () => {
  it('should show search in header for non-practitioners', async () => {
    const result = await runCompute(headerHelper, {
      state: getState('taxpayer'),
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });

  it('should show document qc for internal users', async () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showDocumentQC).toBeTruthy();
    });
  });
  it('should show messages for internal users', async () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMessages).toBeTruthy();
    });
  });
  it('should show trial sessions for internal users', async () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showTrialSessions).toBeTruthy();
    });
  });
  it('should show cases for external users', async () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMyCases).toBeTruthy();
    });
  });
  it('should NOT show search in header for practitioners', async () => {
    const result = await runCompute(headerHelper, {
      state: getState('practitioner'),
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
  it('should NOT show document qc for external users', async () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showDocumentQC).toBeFalsy();
    });
  });
  it('should NOT show trial sessions for external users', async () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showTrialSessions).toBeFalsy();
    });
  });
  it('should NOT show messages for external users', async () => {
    external.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMessages).toBeFalsy();
    });
  });
  it('should NOT show cases for internal users', async () => {
    interal.forEach(role => {
      const result = runCompute(headerHelper, {
        state: getState(role),
      });
      expect(result.showMyCases).toBeFalsy();
    });
  });
  it('should know when the page is Messages', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'DashboardPetitionsClerk',
        workQueueIsInternal: true,
      },
    });
    expect(result.pageIsMessages).toBeTruthy();
  });
  it('should know when the page is My Cases', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        ...getState('petitioner'),
        currentPage: 'DashboardPetitioner',
      },
    });
    expect(result.pageIsMyCases).toBeTruthy();
  });
  it('should not set pageIsMessages or pageIsDocumentQC to true if currentPage is TrialSessions', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsMyCases).toBeFalsy();
    expect(result.pageIsDocumentQC).toBeFalsy();
  });
  it('should know when the page is TrialSessions', async () => {
    const result = await runCompute(headerHelper, {
      state: {
        ...getState('petitionsclerk'),
        currentPage: 'TrialSessions',
      },
    });
    expect(result.pageIsTrialSessions).toBeTruthy();
  });
});
