# Finding Cases to Which Private Practitioners from a Specific Law Firm are Assigned

Today we had a request from docket to deliver a list of all cases involving private practitioners employed by a specific law firm. Because the `firmName` field is not indexed on the `efcms-user` elasticsearch index, we were unable to fulfill this request in a single query. This document describes the steps necessary to generate a new `efcms-user-practitioner-firm` index with the `firmName` field indexed.

Slightly complicating matters, the name of the law firm has varied over time, so we will need to perform a wildcard search and not a keyword search.

### Creating the new index and populating it with data from the existing index

1. In a rest client, `PUT` the following payload to the elasticsearch cluster's API endpoint:
   ```
   PUT /efcms-user-practitioner-firm
   {
       "settings": {
           "number_of_shards": 1,
           "number_of_replicas": 0
       },
       "mappings": {
           "properties": {
               "admissionsStatus.S": {
                   "type": "keyword"
               },
               "barNumber.S": {
                   "type": "keyword"
               },
               "contact.M.state.S": {
                   "type": "keyword"
               },
               "entityName.S": {
                   "type": "keyword"
               },
               "firmName.S": {
                   "type": "text"
               },
               "indexedTimestamp.N": {
                   "type": "text"
               },
               "name.S": {
                   "type": "text"
               },
               "pk.S": {
                   "type": "keyword"
               },
               "role.S": {
                   "type": "keyword"
               },
               "sk.S": {
                   "type": "keyword"
               }
           }
       }
   }
   ```
1. Next, `POST` the following payload to the same endpoint:
   ```
   POST _reindex
   {
       "source": {
           "index": "efcms-user"
       },
       "dest": {
           "index": "efcms-user-practitioner-firm"
       }
   }
   ```

### Running the report

Now that you have added the `efcms-user-practitioner-firm` index, you can run the `find-firms-cases.ts` report:

```
npx ts-node --transpile-only shared/admin-tools/elasticsearch/find-firms-cases.ts > ~/Desktop/firms-cases.csv
```
