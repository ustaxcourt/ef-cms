import { COURT_ISSUED_EVENT_CODES } from '@shared/business/entities/EntityConstants';

export const mockCountOfFormattedOpinionsIssuedByJudge = [
  { count: 177, eventCode: 'MOP' },
  {
    count: 53,
    eventCode: 'OST',
  },
  { count: 34, eventCode: 'SOP' },
  { count: 30, eventCode: 'TCOP' },
];

export const mockOpinionsFiledTotal = 269;

const expectedResults = mockCountOfFormattedOpinionsIssuedByJudge.map(item => ({
  ...item,
  documentType: COURT_ISSUED_EVENT_CODES.find(
    event => event.eventCode === item.eventCode,
  ).documentType,
}));

export const mockCountOfOpinionsIssuedByJudge = {
  opinionAggregations: expectedResults,
  opinionTotal: mockOpinionsFiledTotal,
};

export const mockCountOfFormattedOrdersIssuedByJudge = [
  { count: 2, eventCode: 'O' },
  { count: 0, eventCode: 'OAL' },
  { count: 0, eventCode: 'OAP' },
  { count: 0, eventCode: 'OAPF' },
  { count: 0, eventCode: 'OAR' },
  { count: 0, eventCode: 'OAS' },
  { count: 0, eventCode: 'OASL' },
  { count: 0, eventCode: 'OAW' },
  { count: 0, eventCode: 'OAX' },
  { count: 0, eventCode: 'OCA' },
  { count: 0, eventCode: 'OD' },
  { count: 0, eventCode: 'ODD' },
  { count: 0, eventCode: 'ODP' },
  { count: 0, eventCode: 'ODR' },
  { count: 0, eventCode: 'ODS' },
  { count: 0, eventCode: 'ODSL' },
  { count: 0, eventCode: 'ODW' },
  { count: 1, eventCode: 'ODX' },
  { count: 0, eventCode: 'OF' },
  { count: 0, eventCode: 'OFAB' },
  { count: 0, eventCode: 'OFFX' },
  { count: 0, eventCode: 'OFWD' },
  { count: 0, eventCode: 'OFX' },
  { count: 0, eventCode: 'OIP' },
  { count: 0, eventCode: 'OJR' },
  { count: 0, eventCode: 'OODS' },
  { count: 0, eventCode: 'OPFX' },
  { count: 0, eventCode: 'OPX' },
  { count: 0, eventCode: 'ORAP' },
  { count: 0, eventCode: 'OROP' },
  { count: 5, eventCode: 'OSC' },
  { count: 0, eventCode: 'OSCP' },
  { count: 0, eventCode: 'OSUB' },
  { count: 0, eventCode: 'OAD' },
  { count: 0, eventCode: 'ODJ' },
];

export const mockCountOfOrdersIssuedByJudge = {
  orderAggregations: mockCountOfFormattedOrdersIssuedByJudge,
  orderTotal: 7,
};
