import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const counts = await sql<{
    total: string;
    minor: string;
    major: string;
    subset: string;
    exact: string;
  }>`
  with joined as (
  select
    d.docket_entry_id,
    d.docket_number,
    t.multi_docketed_on,
    c.consolidated_with
  from dw_docket_entry d
  join multi_docketed_lookup t
    on t.docket_entry_id = d.docket_entry_id
    and t.docket_number  = d.docket_number
  join consolidated_case_groups c
    on c.docket_number = d.docket_number
),
scored as (
  select
    j.*,
    jsonb_array_length(j.consolidated_with) as consolidated_len,
    (
      select count(*)
      from jsonb_array_elements_text(j.consolidated_with) as cw(val)
      where cw.val = any (j.multi_docketed_on)
    ) as overlap_count,
    ca.consolidated_arr,

    -- set equality (exclude from both)
    (
      j.multi_docketed_on::text[] <@ ca.consolidated_arr
      and
      j.multi_docketed_on::text[] @> ca.consolidated_arr
    ) as exact,

    -- subset: every multi docket value appears in consolidatedWith
    (j.multi_docketed_on::text[] <@ ca.consolidated_arr) as is_subset
  from joined j
  cross join lateral (
    select coalesce(array_agg(e.val), '{}'::text[]) as consolidated_arr
    from jsonb_array_elements_text(j.consolidated_with) as e(val)
  ) ca
)
  select
  count(*)::text as total,
  count(*) filter (
    where (
      (consolidated_len < 2 or overlap_count = 0)
      or (multi_docketed_on::text[] <@ consolidated_arr)  -- subset => minor
    )
    and not (
      multi_docketed_on::text[] <@ consolidated_arr
      and multi_docketed_on::text[] @> consolidated_arr   -- exact match excluded
    )
  )::text as minor,
  count(*) filter (
    where consolidated_len >= 2
      and overlap_count > 1
      and not (multi_docketed_on::text[] <@ consolidated_arr) -- subset removed from major
      and not (
        multi_docketed_on::text[] <@ consolidated_arr
        and multi_docketed_on::text[] @> consolidated_arr     -- exact match excluded
      )
  )::text as major,
  count(*) filter (
    where multi_docketed_on::text[] <@ consolidated_arr
      and multi_docketed_on::text[] @> consolidated_arr
  )::text as exact,
  count(*) filter (
    where (multi_docketed_on::text[] <@ consolidated_arr)
      and not (multi_docketed_on::text[] @> consolidated_arr)
  )::text as subset
from scored
  `.execute(db);

  const row = counts.rows[0];
  console.log('analysis counts:', {
    total: Number(row?.total ?? 0),
    minor: Number(row?.minor ?? 0),
    major: Number(row?.major ?? 0),
    exactMatch: Number(row?.exact ?? 0),
    nonExactMatch: Number(row?.subset ?? 0),
  });

  const minorSample = await sql<
    {
      docketEntryId: string;
      docketNumber: string;
      multiDocketedOn: string[];
      consolidatedWith: unknown;
      consolidatedLen: number;
      overlapCount: number;
    }[]
  >`
  with joined as (
  select
    d.docket_entry_id,
    d.docket_number,
    t.multi_docketed_on,
    c.consolidated_with
  from dw_docket_entry d
  join multi_docketed_lookup t
    on t.docket_entry_id = d.docket_entry_id
    and t.docket_number  = d.docket_number
  join consolidated_case_groups c
    on c.docket_number = d.docket_number
),
scored as (
  select
    j.*,
    jsonb_array_length(j.consolidated_with) as consolidated_len,
    (
      select count(*)
      from jsonb_array_elements_text(j.consolidated_with) as cw(val)
      where cw.val = any (j.multi_docketed_on)
    ) as overlap_count,
    ca.consolidated_arr,
    (
      j.multi_docketed_on::text[] <@ ca.consolidated_arr
      and
      j.multi_docketed_on::text[] @> ca.consolidated_arr
    ) as exact,
    (j.multi_docketed_on::text[] <@ ca.consolidated_arr) as is_subset
  from joined j
  cross join lateral (
    select coalesce(array_agg(e.val), '{}'::text[]) as consolidated_arr
    from jsonb_array_elements_text(j.consolidated_with) as e(val)
  ) ca
)
select
  docket_entry_id as "docketEntryId",
  docket_number   as "docketNumber",
  multi_docketed_on as "multiDocketedOn",
  consolidated_with as "consolidatedWith",
  consolidated_len  as "consolidatedLen",
  overlap_count     as "overlapCount"
from scored
where (
    (consolidated_len < 2 or overlap_count = 0)
    or (multi_docketed_on::text[] <@ consolidated_arr) -- subset => minor
  )
  and not (
    multi_docketed_on::text[] <@ consolidated_arr
    and multi_docketed_on::text[] @> consolidated_arr  -- exact excluded
  )
limit 50
  `.execute(db);

  const majorSample = await sql<
    {
      docketEntryId: string;
      docketNumber: string;
      multiDocketedOn: string[];
      consolidatedWith: unknown;
      consolidatedLen: number;
      overlapCount: number;
    }[]
  >`
  with joined as (
  select
    d.docket_entry_id,
    d.docket_number,
    t.multi_docketed_on,
    c.consolidated_with
  from dw_docket_entry d
  join multi_docketed_lookup t
    on t.docket_entry_id = d.docket_entry_id
    and t.docket_number  = d.docket_number
  join consolidated_case_groups c
    on c.docket_number = d.docket_number
),
scored as (
  select
    j.*,
    jsonb_array_length(j.consolidated_with) as consolidated_len,
    (
      select count(*)
      from jsonb_array_elements_text(j.consolidated_with) as cw(val)
      where cw.val = any (j.multi_docketed_on)
    ) as overlap_count,
    ca.consolidated_arr,
    (
      j.multi_docketed_on::text[] <@ ca.consolidated_arr
      and
      j.multi_docketed_on::text[] @> ca.consolidated_arr
    ) as exact,
    (j.multi_docketed_on::text[] <@ ca.consolidated_arr) as is_subset
  from joined j
  cross join lateral (
    select coalesce(array_agg(e.val), '{}'::text[]) as consolidated_arr
    from jsonb_array_elements_text(j.consolidated_with) as e(val)
  ) ca
)
select
  docket_entry_id as "docketEntryId",
  docket_number   as "docketNumber",
  multi_docketed_on as "multiDocketedOn",
  consolidated_with as "consolidatedWith",
  consolidated_len  as "consolidatedLen",
  overlap_count     as "overlapCount"
from scored
where consolidated_len >= 2
  and overlap_count > 1
  and not (multi_docketed_on::text[] <@ consolidated_arr) -- subset removed
  and not (
    multi_docketed_on::text[] <@ consolidated_arr
    and multi_docketed_on::text[] @> consolidated_arr     -- exact excluded
  )
limit 50
  `.execute(db);

  console.log('minor sample size:', minorSample.rows.length);
  console.log('major sample size:', majorSample.rows.length);

  console.log('minor sample (first 3):', minorSample.rows.slice(0, 3));
  console.log('major sample (first 10):', majorSample.rows.slice(0, 10));
}

// export async function down(db: Kysely<any>): Promise<void> {
// }
