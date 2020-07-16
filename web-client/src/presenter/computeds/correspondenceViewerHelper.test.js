import { correspondenceViewerHelper } from './correspondenceViewerHelper';
import { runCompute } from 'cerebral/test';

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
});
