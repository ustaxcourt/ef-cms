# Blocking IP addresses

This describes a mechanism to block access to EF-CMS, which can be used when an IP address is causing unexpected or unusual traffic. This is an augmentation to other, automated rate limiting and security measures which may also block access, and at best will be used sparingly.

## How to block an IPv4 or IPv6 address

Blocking is done through [AWS Web Application Firewall v2](https://docs.aws.amazon.com/waf/latest/APIReference/Welcome.html), and requests which match blocked patterns will receive `403 Forbidden` status codes when attempting to make API requests.

### Using a bash script

To block an IP address, run:

```bash
./web-api/ban-ip-address.sh [ENVIRONMENT] [IP ADDRESS]
```

For example:

```bash
./ban-ip-address.sh prod 192.0.2.4
./ban-ip-address.sh prod 2001:0db8:0000:0000:0000:0000:0000:0000
```

The script accepts both IPv4 and IPv6 addresses.

### Using the AWS console

1. Log in to the [AWS WAF console](https://console.aws.amazon.com/wafv2/homev2/) and head to **AWS WAF > IP sets** to get started.

2. Select the appropriate IP set for your environment and IP address type from the list — for example, if you’re looking to ban an IPv4 address in the `prod` environment, locate:

    ```
    banned_ipv4_ips_prod
    ```

3. Select **Add IP address** and enter the IP to block in CIDR format.

    _Hint:_ To ban a single IP address in CIDR format, for IPv4 addresses add `/32` to the end. For IPv6 addresses, add `/128`.

    See [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation) for more information.

4. Save the IP set by clicking `Add`.

5. Repeat this process for both `us-east-1` and `us-west-1` regions.

## What happens to blocked requests?

Blocked requests receive  `403 Forbidden` status codes and do not appear in our standard logs, because WAF stops the request from hitting our infrastructure.

**Changes to blocked IPs take effect within seconds.**

To see blocked requests:

1. Log in to the [AWS WAF console](https://console.aws.amazon.com/wafv2/homev2/) and head to **AWS WAF > Web ACLs**.

2. Select the appropriate ACL for your environment — for example, if you’re looking to see blocked requests in the `prod` environment, locate:

    ```
    apis_prod
    ```

3. Observe the graph. Series graphed ending in `BlockedRequests` indicate requests which were terminated, whereas those ending in `CountedRequests` are those which match rules and would be blocked, but they were allowed through (used for testing new rule sets, mostly).
