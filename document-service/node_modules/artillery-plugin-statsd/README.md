# StatsD output for Artillery stats

This [Artillery](https://artillery.io/) plugin allows you to publish the
stats produced by Artillery CLI to StatsD in real-time.

## Usage

### Install

`npm install -g artillery-plugin-statsd` - if you've installed Artillery globally

`npm install artillery-plugin-statsd` otherwise.

### Use

Enable the plugin by adding it in your test script's `config.plugins` section:

```javascript
{
  "config": {
    // ...
    "plugins": {
      "statsd": {
        "host": "localhost",
        "port": 8125,
        "prefix": "artillery"
      }
    }
  }
  // ...
}
```

`host`, `port`, and `prefix` are optional; the values above are the defaults.

### Published metrics

By default, all stats from artillery are reported. This includes any custom stats you may have in place. As of `artillery@1.5.0-17`, the metrics you can expect to see are as follows.

- `scenariosCreated`
- `scenariosCompleted`
- `requestsCompleted`
- `latency.min`
- `latency.max`
- `latency.median`
- `latency.p95`
- `latency.p99`
- `rps.count`
- `rps.mean`
- `scenarioDuration.min`
- `scenarioDuration.max`
- `scenarioDuration.median`
- `scenarioDuration.p95`
- `scenarioDuration.p99`
- `scenarioCounts.0`, `scenarioCounts.0` etc
- `codes.200`, `codes.301` etc
- `errors.ECONNREFUSED`, `errors.ETIMEDOUT` etc
- `matches`
- `concurrency`
- `pendingRequests`

Metrics will be added or removed based on what artillery decides to send.

If a metric is null or cannot be resolved to a number, the default value of `0` is sent. You can change the default value in the configuration by passing in the property `default`. Example:

`"default": 100000` - Metrics are sent with gauges so avoid [negative numbers](https://github.com/etsy/statsd/blob/master/docs/metric_types.md#gauges).

Metrics can be skipped by passing in an additional configuration property `skipList`. Skip list values can look like the following:

- `"skipList": "scenarioDuration"` - would skip all `scenarioDuration` metrics
- `"skipList": "latency.max"` - would skip only the `latency.max` metric
- `"skipList": "scenarioDuration, latency.max"` - a comma separated list can be used to pass in multiple values.

### Using with Librato

This plugin can be used to publish metrics to [Librato](https://www.librato.com):

0. Install StatsD with:

  `npm install statsd`

1. Add Librato backend to StatsD:

  `cd /path/to/statsd`
  `npm install statsd-librato-backend`

  Enable the backend in your StatsD config:

  ```javascript
  {
    librato: {
      email:  "mylibrato@email.com",
      token:  "a161e2bc22b1bdd0cfe90412token10498token22dd52cat792doge1ab5a1d32"
    },
    backends: ['statsd-librato-backend']
  }
  ```

3. Run StatsD and use Artillery with this plugin.

## License

**artillery-plugin-statsd** is distributed under the terms of the
[ISC](http://en.wikipedia.org/wiki/ISC_license) license.
