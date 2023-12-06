import { fileUploadStatusHelper } from './fileUploadStatusHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('fileUploadStatusHelper', () => {
  it('returns `Preparing Upload` for infinity time remaining', () => {
    const result = runCompute(fileUploadStatusHelper, {
      state: {
        fileUploadProgress: {
          isUploading: true,
          noThrottle: true,
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
          noThrottle: true,
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
          noThrottle: true,
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
          noThrottle: true,
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
          noThrottle: true,
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
          noThrottle: true,
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
          noThrottle: true,
          // eslint-disable-next-line prettier/prettier
          timeRemaining: 3600 * 4 + 60 * 21,
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
          noThrottle: true,
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
          noThrottle: true,
          percentComplete: 100,
        },
      },
    });

    expect(result.statusMessage).toEqual('All Done!');
  });

  describe('throttled messages', () => {
    it('throttles the message inside of a three-second window', () => {
      const result1 = runCompute(fileUploadStatusHelper, {
        state: {
          fileUploadProgress: {
            isUploading: true,
            noThrottle: false,
            timeRemaining: Number.POSITIVE_INFINITY,
          },
        },
      });

      expect(result1.statusMessage).toEqual('Preparing Upload');

      const result2 = runCompute(fileUploadStatusHelper, {
        state: {
          fileUploadProgress: {
            isUploading: true,
            noThrottle: false,
            timeRemaining: 30,
          },
        },
      });

      expect(result2.statusMessage).toEqual(result1.statusMessage);
    });

    it('will update the message returned if executions are more than three seconds apart', async () => {
      const result1 = runCompute(fileUploadStatusHelper, {
        state: {
          fileUploadProgress: {
            isUploading: true,
            noThrottle: false,
            timeRemaining: Number.POSITIVE_INFINITY,
          },
        },
      });

      expect(result1.statusMessage).toEqual('Preparing Upload');

      await new Promise(resolve => setTimeout(resolve, 3000));

      const result2 = runCompute(fileUploadStatusHelper, {
        state: {
          fileUploadProgress: {
            isUploading: true,
            noThrottle: false,
            timeRemaining: 30,
          },
        },
      });

      expect(result2.statusMessage).not.toEqual(result1.statusMessage);
    });
  });
});
