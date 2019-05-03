import { runCompute } from 'cerebral/test';

import { fileUploadStatusHelper } from './fileUploadStatusHelper';

describe('fileUploadStatusHelper', () => {
  it('returns `Preparing Upload` for infinity time remaining', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: Number.POSITIVE_INFINITY,
      },
    });

    expect(result.statusMessage).toEqual('Preparing Upload');
  });

  it('returns `Less than 1 Minute Left` for anything less than 60 seconds', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 40,
      },
    });

    expect(result.statusMessage).toEqual('Less than 1 Minute Left');
  });

  it('returns `1 Minutes Left` for time remaining being something between 60 and 3600 seconds', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 61,
      },
    });

    expect(result.statusMessage).toEqual('1 Minutes Left');
  });

  it('returns `1 Minutes Left` for time remaining for 119 seconds remaining', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 119,
      },
    });

    expect(result.statusMessage).toEqual('1 Minutes Left');
  });

  it('returns `59 Minutes Left` for time remaining for 119 seconds remaining', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 3599,
      },
    });

    expect(result.statusMessage).toEqual('59 Minutes Left');
  });

  it('returns `1 Hour Left` for time remaining for 119 seconds remaining', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 3600,
      },
    });

    expect(result.statusMessage).toEqual('1 Hours 0 Minutes Left');
  });

  it('returns `5 Hour Left` for time remaining for 119 seconds remaining', async () => {
    const result = await runCompute(fileUploadStatusHelper, {
      state: {
        timeRemaining: 3600 * 4 + 60 * 21,
      },
    });

    expect(result.statusMessage).toEqual('4 Hours 21 Minutes Left');
  });
});
