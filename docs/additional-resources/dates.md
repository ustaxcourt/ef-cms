# Dates and Times in EFCMS

Why do we need to worry about time zones?
- new Date().toString() will yield different results in each time zone it runs. The web client and servers may, or may not, be running in the same time zones.
- The current hour of the day in EST is different from UTC.
- It’s possible for the day to be different in EST than UTC.
- DateHandler was written to manage the differences between EST and UTC. If we use the Date constructor outside of DateHandler, even in tests, we’re unable to compare dates accurately.
- Even a day with no timestamp (2021-02-23) has an implied time zone. The time zone is dynamic, because it depends on the timezone where the Date object is instantiated.

All timestamps (YYYY-MM-DDTHH:mm:ss.SSSZ) are stored in DynamoDB are stored in UTC. Dates stored in YYYY-MM-DD format are implicitly intended to reflect a calendar day in EST. We are storing dates in 2 different time zones, depending on the format. We expect to apply timezone transformations to all timestamps coming from persistence, but we shouldn’t apply transformations to a date without time, because they’re already in EST. This is important in both application code and tests! Failure to use consistent Date implementations can result in failures that only are exposed during a small window of time.

Please use the DateHandler functions for any situation where a date must be created.
