WITH batch AS (
    SELECT wi.work_item_id, (wip.docket_entry->>'docketEntryId') AS new_id
    FROM dw_work_item wi JOIN dw_work_item_prod wip USING (work_item_id)
    WHERE wip.docket_entry ? 'docketEntryId'
    AND NULLIF(wip.docket_entry->>'docketEntryId', '') IS NOT NULL
    AND COALESCE(wi.docket_entry_id::text, '') <> COALESCE(wip.docket_entry->>'docketEntryId', '')
    ORDER BY wi.work_item_id
    )
UPDATE dw_work_item wi
SET docket_entry_id = batch.new_id
    FROM batch
WHERE wi.work_item_id = batch.work_item_id;
