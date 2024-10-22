import { FileUploadProgressType } from '@shared/business/entities/EntityConstants';
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
          isHavingSystemIssues: false,
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
          isHavingSystemIssues: false,
          isUploading: false,
          percentComplete: 0,
          timeRemaining: Number.POSITIVE_INFINITY,
        },
      },
    });

    const atpResults = results.output.fileUploadProgressMap
      .attachmentToPetition as FileUploadProgressType;
    const petitionResults = results.output.fileUploadProgressMap
      .petition as FileUploadProgressType;
    const stinResults = results.output.fileUploadProgressMap
      .stin as FileUploadProgressType;
    const waiverOfFilingFeeResults = results.output.fileUploadProgressMap
      .waiverOfFilingFee as FileUploadProgressType;
    const trialResults = results.output.fileUploadProgressMap
      .trial as FileUploadProgressType;

    atpResults.uploadProgress({
      isDone: true,
      total: 1,
    });

    petitionResults.uploadProgress({
      isDone: true,
      total: 2,
    });
    stinResults.uploadProgress({
      isDone: true,
      total: 3,
    });

    waiverOfFilingFeeResults.uploadProgress({
      loaded: 0,
      total: 5,
    });
    trialResults.uploadProgress({
      isHavingSystemIssues: true,
      loaded: 0,
      total: 4,
    });

    expect(results.state.fileUploadProgress).toMatchObject({
      isHavingSystemIssues: true,
      isUploading: true,
      percentComplete: 40,
      timeRemaining: 0,
    });

    trialResults.uploadProgress({
      isDone: true,
      isHavingSystemIssues: false,
      total: 4,
    });
    expect(results.state.fileUploadProgress).toMatchObject({
      isHavingSystemIssues: false,
      isUploading: true,
      percentComplete: 66,
      timeRemaining: 0,
    });

    waiverOfFilingFeeResults.uploadProgress({
      isDone: true,
      isHavingSystemIssues: false,
      total: 5,
    });
    expect(results.state.fileUploadProgress).toMatchObject({
      isHavingSystemIssues: false,
      isUploading: true,
      percentComplete: 100,
      timeRemaining: 0,
    });
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
