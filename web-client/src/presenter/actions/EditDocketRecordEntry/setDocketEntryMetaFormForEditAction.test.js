import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocketEntryMetaFormForEditAction } from './setDocketEntryMetaFormForEditAction';

describe('setDocketEntryMetaFormForEditAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { SERVED_PARTIES_CODES } = applicationContext.getConstants();

  let caseDetail;

  beforeAll(() => {
    caseDetail = {
      docketNumber: '123-45',
      docketRecord: [
        {
          index: 1,
        },
        {
          documentId: '123',
          index: 2,
        },
        {
          documentId: '234',
          index: 3,
        },
        {
          documentId: '456',
          index: 4,
          servedPartiesCode: SERVED_PARTIES_CODES.RESPONDENT,
        },
      ],
      documents: [
        {
          documentId: '123',
          eventCode: 'O',
          lodged: false,
        },
        {
          certificateOfService: true,
          certificateOfServiceDate: '2020-02-02',
          documentId: '234',
          eventCode: 'A',
          filingDate: '2020-01-01',
          lodged: false,
          servedAt: '2020-01-01',
          servedParties: [{ name: 'Party Man' }],
        },
        {
          certificateOfService: true,
          certificateOfServiceDate: '2020-02-02',
          documentId: '456',
          eventCode: 'A',
          filingDate: '2020-01-01',
          lodged: false,
        },
      ],
    };
  });

  it('populates state.form with the docket record meta based on the provided props.docketRecordIndex', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 1,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({ index: 1 });
  });

  it('populates state.form with the docket record meta and associated document meta if the docket record has a document', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 2,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({
      documentId: '123',
      eventCode: 'O',
      index: 2,
      lodged: false,
    });
  });

  it('populates state.form with deconstructed certificateOfServiceDate and filingDate if present', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 3,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form).toMatchObject({
      certificateOfService: true,
      certificateOfServiceDate: '2020-02-02',
      certificateOfServiceDay: '2',
      certificateOfServiceMonth: '2',
      certificateOfServiceYear: '2020',
      documentId: '234',
      eventCode: 'A',
      filingDate: '2020-01-01',
      filingDateDay: '1',
      filingDateMonth: '1',
      filingDateYear: '2020',
      index: 3,
      lodged: false,
    });
  });

  it('returns an empty string for servedPartiesCode if the document has no served parties and is not being overwritten by the docketRecordEntry', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 2,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form.servedPartiesCode).toEqual('');
  });

  it('computes the servedPartiesCode from documentDetail when NOT present on docketRecordEntry', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 3,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form.servedPartiesCode).toEqual(
      SERVED_PARTIES_CODES.BOTH,
    );
  });

  it('overwrites documentDetail.servedPartiesCode if servedPartiesCode is present on docketRecordEntry', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 4,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.state.form.servedPartiesCode).toEqual(
      SERVED_PARTIES_CODES.RESPONDENT,
    );
  });

  it('returns initEventCode from the case document', async () => {
    const result = await runAction(setDocketEntryMetaFormForEditAction, {
      modules: { presenter },
      props: {
        docketRecordIndex: 4,
      },
      state: {
        caseDetail,
      },
    });

    expect(result.output).toEqual({
      key: 'initEventCode',
      value: 'A',
    });
  });
});
