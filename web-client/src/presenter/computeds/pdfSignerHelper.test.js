import { pdfSignerHelper } from './pdfSignerHelper';
import { runCompute } from 'cerebral/test';

describe('pdfSignerHelper', () => {
  it('should set disableSaveAndSendButton to true when the message inputs are not defined and pdf data is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {},
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveAndSendButton).toBeTruthy();
  });

  it('should set disableSaveAndSendButton to true when the pdf data is not defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {},
        pdfForSigning: {
          signatureData: null,
        },
      },
    });
    expect(disableSaveAndSendButton).toBeTruthy();
  });

  it('should set disableSaveAndSendButton to false when section is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          section: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveAndSendButton to false when message is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          message: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveAndSendButton to false when assigneeId is defined', () => {
    const { disableSaveAndSendButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          assigneeId: 'a',
        },
        pdfForSigning: {
          signatureData: 'a',
        },
      },
    });
    expect(disableSaveAndSendButton).toBeFalsy();
  });

  it('should set disableSaveButton to true when the pdf data is not defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {},
        pdfForSigning: {
          signatureData: null,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when the pdf data is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {},
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeFalsy();
  });

  it('should set disableSaveButton to true when section is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          section: true,
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when assigneeId is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          assigneeId: 'a',
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });

  it('should set disableSaveButton to true when message is defined', () => {
    const { disableSaveButton } = runCompute(pdfSignerHelper, {
      state: {
        form: {
          message: 'a',
        },
        pdfForSigning: {
          signatureData: true,
        },
      },
    });
    expect(disableSaveButton).toBeTruthy();
  });
});
