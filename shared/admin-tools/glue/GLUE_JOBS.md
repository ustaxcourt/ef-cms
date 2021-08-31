# Glue Jobs 

AWS Glue is capable of moving data from one DynamoDB table to another and transforming it along the way. Currently, this Glue is used to move data from the production dynamoDB table to tables in staging with a small transform to replace email addresses with hashed email addresses at the court's domain. 

To run a Glue job from production you will need:

- Console access to the production account
- The name of the source table from which data will be moved
- The name of the destination table where data will be sent. This table should be empty.

## Running a Glue Job

- In the production AWS account navigate to the Glue console.
- Click "Jobs" in the sidebar.
- Select the "mock_emails" job from the table
- Under the "Action" menu select "Run job"
- This will activate a "Parameters (optional)" modal 
- In this modal expand "Security configuration, script libraries, and job parameters" and scroll to "Job parameters"
- Here you will find parameters for "--source_table" and "--destination_table". Fill these in with the correct values. Other parameters should be correctly pre-populated.
- Hit "Run Job" button

At this point the job should begin. You can monitor progress in the history table on the jobs page. 



