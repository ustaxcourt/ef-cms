import { runAction } from '@web-client/presenter/test.cerebral';
import { setProgressForFileUploadAction } from './setProgressForFileUploadAction';

describe('setProgressForFileUploadAction', () => {
  it('should return files and progress functions for each file passed in and update', async () => {
    const results = await runAction(setProgressForFileUploadAction, {
      props: {
        files: {
          attachmentToPetition: { size: 1 },
          petition: { size: 2 },
          stin: { size: 3 },
          trial: { size: 4 },
          waiverOfFilingFee: { size: 5 },
        },
      },
      state: {
        fileUploadProgress: {
          documentsProgress: {} as Record<string, number>,
          filesTotalBytes: 0,
          isUploading: false,
          percentComplete: 0,
          timeRemaining: Number.POSITIVE_INFINITY,
        },
      },
    });

    expect(results.output.fileUploadProgressMap).toMatchObject({
      attachmentToPetition: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      petition: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      stin: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      trial: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      waiverOfFilingFee: {
        file: {},
        uploadProgress: expect.any(Function),
      },
    });
    expect(results.state.fileUploadProgress.percentComplete).toEqual(0);
    expect(results.state.fileUploadProgress.timeRemaining).toEqual(
      Number.POSITIVE_INFINITY,
    );
    expect(results.state.fileUploadProgress.isUploading).toEqual(true);
  });

  it('should update uploadProgress and percentComplete as files are uploading', async () => {
    const results = await runAction(setProgressForFileUploadAction, {
      props: {
        files: {
          attachmentToPetition: { size: 1 },
          petition: { size: 2 },
          stin: { size: 3 },
          trial: { size: 4 },
          waiverOfFilingFee: { size: 5 },
        },
      },
      state: {
        fileUploadProgress: {
          documentsProgress: {} as Record<string, number>,
          filesTotalBytes: 0,
          isUploading: false,
          percentComplete: 0,
          timeRemaining: Number.POSITIVE_INFINITY,
        },
      },
    });
    results.output.fileUploadProgressMap.attachmentToPetition.uploadProgress({
      isDone: true,
    });
    results.output.fileUploadProgressMap.petition.uploadProgress({
      isDone: true,
    });
    results.output.fileUploadProgressMap.stin.uploadProgress({
      isDone: true,
    });
    results.output.fileUploadProgressMap.trial.uploadProgress({
      isDone: true,
    });
    results.output.fileUploadProgressMap.waiverOfFilingFee.uploadProgress({
      loaded: 0,
      total: 5,
    });

    expect(
      results.state.fileUploadProgress.documentsProgress.waiverOfFilingFee,
    ).toEqual(0);
    expect(results.state.fileUploadProgress.percentComplete).toEqual(66);

    results.output.fileUploadProgressMap.waiverOfFilingFee.uploadProgress({
      loaded: 3,
      total: 5,
    });
    expect(
      results.state.fileUploadProgress.documentsProgress.waiverOfFilingFee,
    ).toEqual(3);
    expect(results.state.fileUploadProgress.percentComplete).toEqual(86);

    results.output.fileUploadProgressMap.waiverOfFilingFee.uploadProgress({
      isDone: true,
    });
    expect(
      results.state.fileUploadProgress.documentsProgress.waiverOfFilingFee,
    ).toEqual(5);
    expect(results.state.fileUploadProgress.percentComplete).toEqual(100);
  });

  it('should not include, in fileUploadProgressMap, keys that have not been uploaded', async () => {
    const results = await runAction(setProgressForFileUploadAction, {
      props: {
        files: {
          attachmentToPetition: { size: 1 },
          noFile: undefined,
          petition: { size: 2 },
          stin: { size: 3 },
          trial: { size: 4 },
        },
      },
    });

    expect(results.output.fileUploadProgressMap).toMatchObject({
      attachmentToPetition: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      petition: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      stin: {
        file: {},
        uploadProgress: expect.any(Function),
      },
      trial: {
        file: {},
        uploadProgress: expect.any(Function),
      },
    });
  });
});
