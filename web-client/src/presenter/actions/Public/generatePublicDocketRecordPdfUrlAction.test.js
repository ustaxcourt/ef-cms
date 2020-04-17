import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePublicDocketRecordPdfUrlAction } from './generatePublicDocketRecordPdfUrlAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('generatePublicDocketRecordPdfUrlAction', () => {
  let createObjectURLStub;
  beforeAll(() => {
    global.Blob = jest.fn();
    createObjectURLStub = jest.fn().mockReturnValue('pdf url');

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };
  });

  it('generates a public docket record pdf url', async () => {
    const result = await runAction(generatePublicDocketRecordPdfUrlAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'case-id-123',
        },
      },
    });

    expect(result.output).toMatchObject({
      pdfUrl: 'pdf url',
    });
    expect(
      applicationContextForClient.getUseCases()
        .generatePublicDocketRecordPdfInteractor,
    ).toBeCalled();
    expect(global.Blob).toBeCalled();
    expect(createObjectURLStub).toBeCalled();
  });
});
