# Postgres Team Review + Vote

**Question**: Should we move forward with RDS Aurora Serverless V2 Postgres, starting with messages, and begin iteratively switching to it?

Ideally DynamoDB usage is nil to minimal (only if use case permits) and OpenSearch is limited to text searches.

Looking for 51% from Flexion Team for Approval

Final Approval is subject to the USTC Team per their organizational structure

## Results

### Flexion
Kaitlyn: Y

Cody: Y

Zach: Y, condition would like to see a database fire drill before going to production. 

Tom: Y

Nechama: Y

Chris: Y, as long as cost increase isn't too much. 

Jon: Y

Nate: Y

Andy:  Y

Javis: Y

### USTC
Jim D: Y

Jim L: Y

Mike: Y

Chris: Y

### Questions

- What are the biggest costs of switching to SQL (developers and project)?
  - Possibly hidden unknowns/costs trying to move all DB/persistance functions (aka developer cost / doing the work)
  - Learning SQL is easy!! 
  - Cost of not doing anything is higher!

- Is this worth trying / what's your recommendation AND why?
  - YES!! 
  - Easier to deal with! Still not sure what proper way to use DynamoDB effectivity for our project.
  - Not just fun side item. Use or cut losses. 

- Do you still see a need for DynamoDB in any capacity?
  - No at this time, maybe file meta data.

- Should we do it all, chunks, or specific entity types first?
  - Message are somewhat separate from other areas.

- Backups automated with AWS
  - Yes, but not restore


### Comments

- More tables could be harder to manage (but easier than dynamodb pains)
- Postgres scaling isn't always clear on how to address (doesn't seem to be issue for USTC) and RDS will help with this.
- Postgres can handle TBs of data.
- DynamoDB usage CAN be better however after working on project believe wrong database for this project. Relational is right for USTC.
- DynamoDB know your access patterns. 
- What's the cost of keep dynamodb around?
- SQL can get messy and problematic as well, for record.
- DynamoDB is easier to initially setup, but thinking about what to do with migration process (streams, duplicates, waiting). Cost is high but not always visible. 
- How fast you can create new relationships, is one of the largest benefit.
- Teaching migrations is very hard and a lot can go wrong currently. 

### Feedback

- Impressive how much work was done within this ticket!!

## Additional Action Items

- Database fire drill - Production database went offline, restore from copy. We've not tested this in DynamoDB but this is in general a good practice that should ALWAYS be done. Make sure this is documented as well.

- Pricing check on Flexion Side 