const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} = require('../EntityConstants');
const { Case } = require('./Case');

describe('updateDocketNumberRecord records suffix changes', () => {
  it('should create a notice of docket number change document when the suffix updates for an electronically created case', () => {
    const caseToVerify = new Case(
      {
        docketNumber: '123-19',
        initialDocketNumberSuffix: 'S',
        isPaper: false,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    );
    expect(caseToVerify.initialDocketNumberSuffix).toEqual('S');
    caseToVerify.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
    caseToVerify.updateDocketNumberRecord({
      applicationContext,
    });
    expect(caseToVerify.docketEntries.length).toEqual(1);
    expect(caseToVerify.docketEntries[0]).toMatchObject({
      index: 1,
      isMinuteEntry: true,
      isOnDocketRecord: true,
    });
  });

  it('should not create a notice of docket number change document when the suffix updates but the case was created from paper', () => {
    const caseToVerify = new Case(
      {
        docketNumber: '123-19',
        isPaper: true,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    );
    expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
    caseToVerify.updateDocketNumberRecord({
      applicationContext,
    });
    expect(caseToVerify.docketEntries.length).toEqual(0);
  });

  it('should not create a notice of docket number change document if suffix has not changed', () => {
    const caseToVerify = new Case(
      { docketNumber: '123-19' },
      {
        applicationContext,
      },
    );
    expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
    caseToVerify.updateDocketNumberRecord({
      applicationContext,
    });
    expect(caseToVerify.docketEntries.length).toEqual(0);
  });

  it('should add notice of docket number change document when the docket number changes from the last updated docket number', () => {
    const caseToVerify = new Case(
      {
        caseCaption: 'A Very Berry New Caption',
        docketEntries: [
          {
            documentTitle:
              "Docket Number is amended from '123-19A' to '123-19B'",
            index: 1,
            isOnDocketRecord: true,
          },
          {
            documentTitle:
              "Docket Number is amended from '123-19B' to '123-19P'",
            index: 2,
            isOnDocketRecord: true,
          },
        ],
        docketNumber: '123-19',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      {
        applicationContext,
      },
    );
    caseToVerify.docketNumberSuffix = DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER;
    caseToVerify.updateDocketNumberRecord({
      applicationContext,
    });
    expect(caseToVerify.docketEntries.length).toEqual(3);
    expect(caseToVerify.docketEntries[2].documentTitle).toEqual(
      "Docket Number is amended from '123-19P' to '123-19W'",
    );
    expect(caseToVerify.docketEntries[2].eventCode).toEqual('MIND');
    expect(caseToVerify.docketEntries[2].index).toEqual(3);
  });
});
