import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateIrsNoticeIndexPropertyAction } from '@web-client/presenter/actions/updateIrsNoticeUploadedFileAction';

describe('updateIrsNoticeIndexPropertyAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set an initial value of irs notice info', async () => {
    const results = await runAction(updateIrsNoticeIndexPropertyAction, {
      modules: {
        presenter,
      },
      props: {
        key: 0,
        property: 'caseType',
        toFormat: undefined,
        value: 'CDP (Lien/Levy)',
      },
    });

    expect(results.state.irsNoticeUploadFormInfo).toEqual({
      0: { caseType: 'CDP (Lien/Levy)' },
    });
  });

  it('should update an existing property on irs notice info', async () => {
    const results = await runAction(updateIrsNoticeIndexPropertyAction, {
      modules: {
        presenter,
      },
      props: {
        key: 0,
        property: 'caseType',
        toFormat: undefined,
        value: 'Deficiency',
      },
      state: {
        0: { caseType: 'CDP (Lien/Levy)', taxYear: '2023' },
      },
    });

    expect(results.state.irsNoticeUploadFormInfo).toEqual({
      0: { caseType: 'Deficiency' },
    });
  });

  it('should add a new entry to irs notice info', async () => {
    const results = await runAction(updateIrsNoticeIndexPropertyAction, {
      modules: {
        presenter,
      },
      props: {
        key: 1,
        property: 'caseType',
        toFormat: undefined,
        value: 'Deficiency',
      },
      state: {
        irsNoticeUploadFormInfo: {
          0: { caseType: 'CDP (Lien/Levy)', taxYear: '2023' },
        },
      },
    });
    expect(results.state.irsNoticeUploadFormInfo).toEqual({
      0: { caseType: 'CDP (Lien/Levy)', taxYear: '2023' },
      1: { caseType: 'Deficiency' },
    });
  });

  it('should remove a property from an existing irs notice info', async () => {
    const results = await runAction(updateIrsNoticeIndexPropertyAction, {
      modules: {
        presenter,
      },
      props: {
        key: 1,
        property: 'taxYear',
        toFormat: undefined,
        value: undefined,
      },
      state: {
        irsNoticeUploadFormInfo: {
          0: { caseType: 'CDP (Lien/Levy)', taxYear: '2023' },
          1: { caseType: 'CDP (Lien/Levy)', taxYear: '2024' },
        },
      },
    });
    expect(results.state.irsNoticeUploadFormInfo).toEqual({
      0: { caseType: 'CDP (Lien/Levy)', taxYear: '2023' },
      1: { caseType: 'CDP (Lien/Levy)' },
    });
  });

  it('should format and set a date property correctly', async () => {
    const results = await runAction(updateIrsNoticeIndexPropertyAction, {
      modules: {
        presenter,
      },
      props: {
        key: '0',
        property: 'noticeIssuedDate',
        toFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
        value: '07/30/2024',
      },
    });

    expect(results.state.irsNoticeUploadFormInfo).toEqual({
      0: { noticeIssuedDate: '2024-07-30T00:00:00.000-04:00' },
    });
  });
});
