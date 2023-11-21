import {
  JURISDICTIONAL_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import { RawStamp } from '@shared/business/entities/Stamp';

export const MOCK_STAMP: RawStamp = {
  customText: 'Custom stamp data text',
  date: '07/27/37',
  disposition: MOTION_DISPOSITIONS.DENIED,
  dueDateMessage: 'The parties shall file a status report by',
  entityName: 'Stamp',
  jurisdictionalOption: JURISDICTIONAL_OPTIONS.restoredToDocket,
};
