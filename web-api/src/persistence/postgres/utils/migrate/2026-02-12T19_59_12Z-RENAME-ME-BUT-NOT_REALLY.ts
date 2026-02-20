import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('multiDocketedLookup')
    // .temporary()
    .as(
      db
        .selectFrom(
          db
            .selectFrom('dwDocketEntry')
            .select([
              'docketEntryId',
              'docketNumber',

              sql<number>`count(*) over (partition by docket_entry_id)`.as(
                'docketEntryCount',
              ),

              sql<string[]>`
                array_agg(docket_number) over (
                  partition by docket_entry_id
                  order by docket_number
                  rows between unbounded preceding and unbounded following
                )
              `.as('multiDocketedOn'),

              sql<string>`
                (
                  array_agg(docket_number) over (
                    partition by docket_entry_id
                    order by
                      case
                        when split_part(docket_number, '-', 2)::int >= 65
                          then 1900 + split_part(docket_number, '-', 2)::int
                        else 2000 + split_part(docket_number, '-', 2)::int
                      end,
                      split_part(docket_number, '-', 1)::int
                    rows between unbounded preceding and unbounded following
                  )
                )[1]
              `.as('originallyFiledDocketNumber'),
            ])
            .as('x'),
        )
        .select([
          'docketEntryId',
          'docketNumber',
          'multiDocketedOn',
          'originallyFiledDocketNumber',
        ])
        .where('docketEntryCount', '>', 1),
    )
    .execute();

  await db.schema
    .createIndex('temp_docket_entry_id_docket_number_uidx')
    .on('multiDocketedLookup')
    .columns(['docketEntryId', 'docketNumber'])
    .unique()
    .execute();

  await db.schema
    .createTable('consolidatedCaseGroups')
    // .temporary()
    .as(
      sql`
      with dockets_of_interest as (
        select distinct unnest(multi_docketed_on) as docket_number
        from multi_docketed_lookup
      ),
      interest_with_lead as (
        select
          doi.docket_number,
          c.lead_docket_number
        from dockets_of_interest doi
        join dw_case c
          on c.docket_number = doi.docket_number
      ),
      group_members as (
        select
          c.lead_docket_number,
          array_agg(c.docket_number order by c.docket_number) as members
        from dw_case c
        join (select distinct lead_docket_number from interest_with_lead) leads
          on leads.lead_docket_number = c.lead_docket_number
        group by c.lead_docket_number
      )
      select
        iwl.docket_number,
        iwl.lead_docket_number,
        coalesce(to_jsonb(gm.members), '[]'::jsonb) as consolidated_with
      from interest_with_lead iwl
      join group_members gm
        on gm.lead_docket_number = iwl.lead_docket_number
    `,
    )
    .execute();

  await db.schema
    .createIndex('consolidated_case_groups_docket_number_uidx')
    .on('consolidatedCaseGroups')
    .column('docketNumber')
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('multiDocketedLookup').ifExists().execute();
  await db.schema.dropTable('consolidatedCaseGroups').ifExists().execute();
}
