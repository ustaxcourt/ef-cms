import { fileUploadStatusHelper } from './fileUploadStatusHelper';
import { runCompute } from 'cerebral/test';

describe('fileUploadStatusHelper', () => {
  it('returns `Preparing Upload` for infinity time remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: Number.POSITIVE_INFINITY,
        },
      },
    });

    expect(result.statusMessage).toEqual('Preparing Upload');
  });

  it('returns `Less Than 1 Minute Left` for anything less than 60 seconds', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: 40,
        },
      },
    });

    expect(result.statusMessage).toEqual('Less Than 1 Minute Left');
  });

  it('returns `X Minutes Left` for time remaining being something between 60 and 3600 seconds', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: 61,
        },
      },
    });

    expect(result.statusMessage).toEqual('1 Minutes Left');
  });

  it('returns `1 Minutes Left` for time remaining for 119 seconds remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: 119,
        },
      },
    });

    expect(result.statusMessage).toEqual('1 Minutes Left');
  });

  it('returns `59 Minutes Left` for time remaining for 3599 seconds remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: 3599,
        },
      },
    });

    expect(result.statusMessage).toEqual('59 Minutes Left');
  });

  it('returns `1 Hour Left` for time remaining for 3600 seconds remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          timeRemaining: 3600,
        },
      },
    });

    expect(result.statusMessage).toEqual('1 Hours 0 Minutes Left');
  });

  it('returns `4 Hours 21 Minutes Left` for time remaining for 15,660 seconds remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          // prettier-ignore
          timeRemaining: (3600 * 4) + (60 * 21)
        },
      },
    });

    expect(result.statusMessage).toEqual('4 Hours 21 Minutes Left');
  });

  it('returns status message of `Just Finishing Up` if percentComplete is 100', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          percentComplete: 100,
        },
      },
    });

    expect(result.statusMessage).toEqual('Just Finishing Up');
  });

  it('returns status message of `All Done!` if isUploading is false', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: false,
          percentComplete: 100,
        },
      },
    });

    expect(result.statusMessage).toEqual('All Done!');
  });
});
