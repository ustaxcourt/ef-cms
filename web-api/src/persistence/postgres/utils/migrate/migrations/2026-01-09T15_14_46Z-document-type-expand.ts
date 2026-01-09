import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {

 await db
    .updateTable('dwDocketEntry')
    .set(eb => ({
      documentType: eb
        .case()
        .when(eb('documentType', '=', 'Motion to Withdraw Counsel (filed by petitioner)')) // Or use eventCode M116
        .then('Motion to Withdraw Counsel by Party')
        .else(eb.ref('documentType'))
        .end(),
    }))
    .execute();
}


export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({
      documentType: eb
        .case()
        .when(eb('documentType', '=', 'Motion to Withdraw Counsel by Party'))
        .then('Motion to Withdraw Counsel (filed by petitioner)')
        .else(eb.ref('documentType'))
        .end(),
    }))
    .execute();
}