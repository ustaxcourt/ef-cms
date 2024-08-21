import { generatePetitionPreviewPdfUrlAction } from '@web-client/presenter/actions/generatePetitionPreviewPdfUrlAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { testPdfDoc } from '@shared/business/test/getFakeFile';

describe('generatePetitionPreviewPdfUrlAction', () => {
  const fakeFile = testPdfDoc;

  const b64File = `data:application/pdf;base64,${Buffer.from(
    String.fromCharCode.apply(null, [...fakeFile]),
  ).toString('base64')}`;

  const mocks = {
    readAsArrayBufferMock: jest.fn(function () {
      this.result = fakeFile.buffer;
      this.onload();
    }),
    readAsDataURLMock: jest.fn(function () {
      this.result = b64File;
      this.onload();
    }),
  };

  function MockFileReader(this) {
    this.onload = null;
    this.onerror = null;
    this.readAsDataURL = mocks.readAsDataURLMock;
    this.readAsArrayBuffer = mocks.readAsArrayBufferMock;
  }

  beforeAll(() => {
    global.atob = jest.fn(x => x);
    global.URL.createObjectURL = jest.fn(() => 'fakePdfUri');

    presenter.providers.path = {
      error: jest.fn(),
      success: jest.fn(),
    };
    presenter.providers.applicationContext.getFileReaderInstance = jest.fn(
      () => new MockFileReader(),
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('sets the pdf url on state for files that are present', async () => {
    const result = await runAction(generatePetitionPreviewPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          corporateDisclosureFile: b64File,
          hasIrsNotice: true,
          irsNotices: [{ file: b64File }],
          petitionFile: b64File,
          stinFile: b64File,
        },
      },
    });

    expect(result.state.petitionFormatted.petitionFileUrl).toEqual(
      'fakePdfUri',
    );
    expect(result.state.petitionFormatted.stinFileUrl).toEqual('fakePdfUri');
    expect(result.state.petitionFormatted.corporateDisclosureFileUrl).toEqual(
      'fakePdfUri',
    );
    expect(
      result.state.petitionFormatted.irsNotices![0].irsNoticeFileUrl,
    ).toEqual('fakePdfUri');
  });

  it('should not set pdf urls when there are no files present', async () => {
    const result = await runAction(generatePetitionPreviewPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {},
      },
    });

    expect(result.state.petitionFormatted.stinFileUrl).toBeUndefined();
    expect(
      result.state.petitionFormatted.corporateDisclosureFileUrl,
    ).toBeUndefined();
    expect(result.state.petitionFormatted.irsNotices).toBeUndefined();
  });

  it('should set the pdf urls for whichever files are present', async () => {
    const result = await runAction(generatePetitionPreviewPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          corporateDisclosureFile: null,
          hasIrsNotice: true,
          irsNotices: [{ file: b64File }, { file: null }],
          stinFile: b64File,
        },
      },
    });

    expect(result.state.petitionFormatted.stinFileUrl).toEqual('fakePdfUri');
    expect(
      result.state.petitionFormatted.corporateDisclosureFileUrl,
    ).toBeUndefined();
    expect(
      result.state.petitionFormatted.irsNotices![0].irsNoticeFileUrl,
    ).toEqual('fakePdfUri');
    expect(
      result.state.petitionFormatted.irsNotices![1].irsNoticeFileUrl,
    ).toBeUndefined();
  });

  it('should set pdf urls for multiple IRS notices', async () => {
    const result = await runAction(generatePetitionPreviewPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          hasIrsNotice: true,
          irsNotices: [{ file: b64File }, { file: b64File }],
        },
      },
    });

    expect(
      result.state.petitionFormatted.irsNotices![0].irsNoticeFileUrl,
    ).toEqual('fakePdfUri');
    expect(
      result.state.petitionFormatted.irsNotices![1].irsNoticeFileUrl,
    ).toEqual('fakePdfUri');
  });

  it('should set the pdf to empty string if createObjectURL fails', async () => {
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn(() => {
      throw new Error('error');
    });

    const result = await runAction(generatePetitionPreviewPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        petitionFormatted: {
          corporateDisclosureFile: b64File,
        },
      },
    });

    expect(result.state.petitionFormatted.corporateDisclosureFileUrl).toEqual(
      '',
    );
    global.URL.createObjectURL = originalCreateObjectURL; // Restore original function
  });
});
