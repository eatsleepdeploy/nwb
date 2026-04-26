import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
 // no-op cause we already have data
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // no-op cause we already have data
}
