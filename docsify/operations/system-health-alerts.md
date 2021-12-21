# System health alerts

By default, EF-CMS performs system health monitoring to ensure the application is available and its underlying data stores are healthy. It performs most of these monitoring tasks using **Route53 Health Checks** and delivers notifications when health status changes to a **Simple Notification Service** queue.

## Subscribing to alerts

There are no targets for notifications by default. To subscribe to alerts, log in to the AWS Console, head to the Simple Notification Service dashboard, and select the `system_health_alarms` topic.

Click **Create subscription** and select your desired protocol (Email, SMS, and HTTPS as well as any protocol in the list).

After adding the subscription, you will need to confirm it to be subscribed — so head to your Email inbox (or other protocol) and perform the requested confirmation step (for example, clicking on the confirmation link).

## Monitoring alert status

You can also view the current state of all system health alerts in CloudWatch. Head to the AWS Console and select CloudWatch to access the console, and then head to the **Alarms** section.

# What to do if you receive a system health alert

In the event of a health alarm that impacts the system, follow [DAWSON’s Contingency Plan](https://github.com/ustaxcourt/ato/blob/master/Operating-Plan.md#contingency-plan-outline).
