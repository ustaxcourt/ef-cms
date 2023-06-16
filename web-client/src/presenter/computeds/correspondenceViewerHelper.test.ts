import { correspondenceViewerHelper } from './correspondenceViewerHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('correspondenceViewerHelper', () => {
  it('returns showDeleteCorrespondenceButton true if the user has the CASE_CORRESPONDENCE permissions', () => {
    const result = runCompute(correspondenceViewerHelper, {
      state: {
        permissions: {
          CASE_CORRESPONDENCE: true,
        },
      },
    });

    expect(result.showDeleteCorrespondenceButton).toEqual(true);
  });

  it('returns showDeleteCorrespondenceButton false if the user does NOT have the CASE_CORRESPONDENCE permissions', () => {
    const result = runCompute(correspondenceViewerHelper, {
      state: {
        permissions: {
          CASE_CORRESPONDENCE: false,
        },
      },
    });

    expect(result.showDeleteCorrespondenceButton).toEqual(false);
  });

  it('returns showEditCorrespondenceButton true if the user has the CASE_CORRESPONDENCE permissions', () => {
    const result = runCompute(correspondenceViewerHelper, {
      state: {
        permissions: {
          CASE_CORRESPONDENCE: true,
        },
      },
    });

    expect(result.showEditCorrespondenceButton).toEqual(true);
  });

  it('returns showEditCorrespondenceButton false if the user does NOT have the CASE_CORRESPONDENCE permissions', () => {
    const result = runCompute(correspondenceViewerHelper, {
      state: {
        permissions: {
          CASE_CORRESPONDENCE: false,
        },
      },
    });

    expect(result.showEditCorrespondenceButton).toEqual(false);
  });

  it('returns editCorrespondenceLink with docketNumber and viewerCorrespondenceToDisplay.correspondenceId', () => {
    const DOCKET_NUMBER = '101-20';
    const CORRESPONDENCE_ID = 'a98c85c2-8814-4df5-b9f1-7134e35b5b52';

    const result = runCompute(correspondenceViewerHelper, {
      state: {
        caseDetail: {
          docketNumber: DOCKET_NUMBER,
        },
        permissions: {
          CASE_CORRESPONDENCE: false,
        },
        viewerCorrespondenceToDisplay: {
          correspondenceId: CORRESPONDENCE_ID,
        },
      },
    });

    expect(result.editCorrespondenceLink).toEqual(
      `/case-detail/${DOCKET_NUMBER}/edit-correspondence/${CORRESPONDENCE_ID}`,
    );
  });
});
