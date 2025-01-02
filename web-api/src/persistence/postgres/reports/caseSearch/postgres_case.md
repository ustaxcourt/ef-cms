- While provisioned Aurora plays nicely with a variety of good change data capture tools, we want <u>serverless Aurora</u> because we don't want to dedicate staff to maintenance/keeping the instance up-to-date, scaling, etc.
- However, getting a real-time change data capture pipeline for this is difficult:
  - Scalable and reliable, but higher latency: Data Migration Service. I see conflicting information, and latency is obviously tied to specific implementations, but the time scale seems like seconds to minutes. Even if it would work, we are setting up a lot of likely temporary infrastructure.
  - Fast, but less scalable/reliable: Using postgres triggers to directly invoke lambdas could work. We would pass along the information to a lightweight lambda to insert data into a Kinesis stream for resiliency. But what if that first lambda invocation failed? And this puts slightly more load on the DB instance.
  - Fast, but less scalable/reliable: We could put our postgres writer helper (getDBWriter) in some sort of wrapper that inserts data into a Kinesis stream. But this means either a) our writes to postgres are coupled with our writes to Kinesis (e.g., maybe we could wrap the whole shebang in a transaction) or b) we need to handle Kinesis retries/etc. in code.
- Maybe most of this can just be avoided? We can just move Open Search queries into postgres with each slice of work since Open Search humanization is only critical for Docket Entry. If we just need to support indexing for Docket Entry, then latency/scalability are both less critical.
  - Unfortunately, this is tricky for something as extensive as case. There are queries that implicate other, future tables, like users.
  - It seems like we would need to either 1) move users over into postgres as well -- which is doable, but now represents a much larger chunk of work on an already large chunk of work -- or 2) postpone case and get users into postgres.

Here are some options I can think of:
- Move off of serverless Aurora. Big con: we need to manage it.
- Try DMS. Con: It might be too high latency, and it is likely a lot of temporary infrastructure.
- Use a less scalable solution temporarily. Con: It is less scalable/reliable, and "temporary" is often dangerous.
- Move users/etc. into postgres.
- 

LOL getCasesByUserId is unused :facepalm

