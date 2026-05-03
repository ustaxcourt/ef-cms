# Database Migrations

Dawson uses PostgreSQL with a versioned migrations workflow. Each new feature or schema change includes a corresponding migration file that is applied automatically during CI/CD deployments.

Because migrations modify the schema, environments must move forward in version order. Rolling an environment *backward* (e.g., reverting an experimental environment back to staging) can create a mismatch between:

* the **codebase version** being deployed, and

* the **migration history** recorded in the database.

If the experimental environment contains a migration entry for a feature that has not yet been merged into staging, deploying staging to that environment may fail. The app cannot start because the database has already advanced beyond the schema expected by the staging code.

**Important Notes for Experimental → Staging Reverts**

* Reverting an environment to staging does not automatically revert database schema.

* If the environment’s database includes migrations from unmerged development features, those migration entries may need to be manually rolled back or removed before staging can deploy successfully.

* Failing to do so may result in failed CI/CD runs or application startup errors.