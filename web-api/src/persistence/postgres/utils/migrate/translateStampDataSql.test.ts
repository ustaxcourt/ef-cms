import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import {
  buildDraftOrderStateFromStampDataSql,
  buildPreviousDocumentSql,
  TRANSLATE_STAMP_FIELDS_SQL_FRAGMENT,
} from './translateStampDataSql';

describe('translateStampDataSql', () => {
  it('includes grant/deny orderType and previousDocument resolution in draft order state SQL', () => {
    const sql = buildDraftOrderStateFromStampDataSql(
      'stamp_data',
      'dw_docket_entry',
    );

    expect(sql).toContain(
      `'orderType',                '${GRANT_DENY_MOTION_OPTIONS.orderType}'`,
    );
    expect(sql).toContain("'previousDocument'");
    expect(sql).toContain("stamp_data->>'motionDocketEntryId'");
    expect(sql).toContain('previous_document->>');
    expect(sql).toContain('^Order - (.+?) - (?:GRANTED|DENIED)');
  });

  it('keeps legacy stamp field translations in the stamp fields fragment', () => {
    expect(TRANSLATE_STAMP_FIELDS_SQL_FRAGMENT).toContain(
      "SOURCE->>'jurisdictionalOption'",
    );
    expect(TRANSLATE_STAMP_FIELDS_SQL_FRAGMENT).toContain(
      "SOURCE->>'customText'",
    );
  });

  it('builds previousDocument SQL for trigger rows using NEW alias', () => {
    expect(buildPreviousDocumentSql('NEW')).toContain('NEW.stamp_data');
    expect(buildPreviousDocumentSql('NEW')).toContain('NEW.document_title');
  });
});
