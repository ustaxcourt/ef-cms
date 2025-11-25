# DAWSON Postgres Schema

This directory contains the following files pertaining to the structure of
DAWSON's postgres database.

**data-dictionary.csv** describes the name, type, and purpose of every field in
the database. This file also flags fields that require follow-up now that the
migration from dynamo to postgres is complete.

**erd.mdd** documents the relations between the tables that the database
comprises.
