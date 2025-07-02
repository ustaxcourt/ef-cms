import {
  CASE_STATUS_TYPES,
  CHAMBERS_SECTION,
  DOCKET_SECTION,
} from '../business/entities/EntityConstants';
import { MOCK_CASE } from './mockCase';
import { RawWorkItem } from '@shared/business/entities/WorkItem';

export const MOCK_WORK_ITEM: RawWorkItem = Object.freeze({
  assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  assigneeName: 'Test Docketclerk',
  associatedJudge: 'Chief Judge',
  associatedJudgeId: '93c9fa05-ded6-4f23-8b15-53c3a0f12130',
  caseStatus: CASE_STATUS_TYPES.closed,
  caseTitle: MOCK_CASE.caseCaption,
  completedAt: '2022-02-01T17:21:07.638Z',
  completedBy: 'Test Docketclerk',
  completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  completedMessage: 'completed',
  createdAt: '2022-02-01T17:21:07.511Z',
  docketEntryId: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
  docketNumber: MOCK_CASE.docketNumber,
  docketNumberWithSuffix: MOCK_CASE.docketNumberWithSuffix!,
  entityName: 'WorkItem',
  highPriority: false,
  inProgress: false,
  section: DOCKET_SECTION,
  sentBy: 'Test Docketclerk',
  sentBySection: CHAMBERS_SECTION,
  sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  updatedAt: '2022-02-01T17:21:07.511Z',
  workItemId: 'dbcb915a-5ed1-45c4-9d6d-b66679a55029',
});
