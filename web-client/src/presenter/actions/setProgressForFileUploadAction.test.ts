/* eslint-disable */

import { runAction } from '@web-client/presenter/test.cerebral';
import { setProgressForFileUploadAction } from './setProgressForFileUploadAction';

// this goes to new function
describe('setProgressForFileUploadAction', () => {
  it('should return progress functions for each file passed in', async () => {
    // const result = setProgressForFileUploadAction(
    //   {
    //     atp: { size: 1 },
    //     ownership: { size: 1 },
    //     petition: { size: 2 },
    //     stin: { size: 3 },
    //     trial: { size: 4 },
    //     waiverOfFilingFee: { size: 5 },
    //   },
    //   store,
    //   get: jest.fn(),
    // );

    const result = await runAction(setProgressForFileUploadAction, {
      props: {
        files: {
          // atp: fileMetaData,
          // corporate: fileMetaData,
          // petition: fileMetaData,
          // requestForPlaceOfTrial: fileMetaData,
          // stin: fileMetaData,
          // waiverOfFilingFee: fileMetaData,
        },
      },
      state: {},
    });

    console.log('result', result);

    expect(result).toMatchObject({
      atp: {},
      ownership: {},
      petition: {},
      stin: {},
      trial: {},
      waiverOfFilingFee: {},
    });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(0);
    expect(storeObject['fileUploadProgress.timeRemaining']).toEqual(
      Number.POSITIVE_INFINITY,
    );
    expect(storeObject['fileUploadProgress.isUploading']).toEqual(true);

    result.atp.uploadProgress({ isDone: true });
    result.ownership.uploadProgress({ isDone: true });
    result.petition.uploadProgress({ isDone: true });
    result.stin.uploadProgress({ isDone: true });
    result.trial.uploadProgress({ isDone: true });
    result.waiverOfFilingFee.uploadProgress({ loaded: 0, total: 1 });
    expect(storeObject['fileUploadProgress.percentComplete']).toEqual(91);
    // result.waiverOfFilingFee({ isDone: true });
    // expect(storeObject['fileUploadProgress.percentComplete']).toEqual(100);
  });
});
