import { addDocumentTypeToEventCodeAggregation } from '@shared/business/useCases/judgeActivityReport/addDocumentTypeToEventCodeAggregation';

export const mockCountOfFormattedOpinionsIssuedByJudge = [
  { count: 177, eventCode: 'MOP' },
  {
    count: 53,
    eventCode: 'OST',
  },
  { count: 34, eventCode: 'SOP' },
  { count: 30, eventCode: 'TCOP' },
];

export const mockCountOfOpinionsWithDocType =
  addDocumentTypeToEventCodeAggregation(
    mockCountOfFormattedOpinionsIssuedByJudge,
  );

export const mockOpinionsFiledTotal = 269;

export const mockCountOfOpinionsIssuedByJudge = {
  aggregations: mockCountOfOpinionsWithDocType,
  total: mockOpinionsFiledTotal,
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

export const mockCountOfOrdersWithDocType =
  addDocumentTypeToEventCodeAggregation(
    mockCountOfFormattedOrdersIssuedByJudge,
  );

export const mockCountOfOrdersIssuedByJudge = {
  aggregations: mockCountOfOrdersWithDocType,
  total: 7,
};
