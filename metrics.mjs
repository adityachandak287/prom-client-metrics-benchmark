// @ts-check

import assert from "assert";
import { Histogram, Summary } from "prom-client";

const RANGE_MIN = 1;
const RANGE_MAX = 10_000;

/**
 *
 * @param { Summary<string> } client
 * @param { number } iterations
 */
async function benchSummary(client, iterations) {
  for (let idx = 1; idx <= iterations; idx++) {
    client.observe(Math.random() * (RANGE_MAX - RANGE_MIN) + RANGE_MIN);
  }

  const result = await client.get();

  console.log(result.name);
  for (const res of result.values) {
    if (res.labels.quantile) {
      console.log(`p${res.labels.quantile}`, res.value);
    }
  }
  console.log("====");
}

/**
 *
 * @param { Histogram<string> } client
 * @param { number } iterations
 */
async function benchHistogram(client, iterations) {
  for (let idx = 1; idx <= iterations; idx++) {
    client.observe(Math.random() * (RANGE_MAX - RANGE_MIN) + RANGE_MIN);
  }

  const result = await client.get();

  console.log(result.name);
  for (const res of result.values) {
    if (res.labels.le) {
      console.log(`le ${res.labels.le}`, res.value);
    }
  }
  console.log("====");
}

const args = process.argv.slice(2);
console.log(args);

assert(args.length >= 2);

const [metric, iterationsStr] = args;

const ITERATIONS = Number(iterationsStr);

switch (metric) {
  case "summary1": {
    const summary = new Summary({
      name: "test_metric_summary",
      help: "test_metric_summary",
      percentiles: [0, 0.5, 0.75, 0.9, 0.95, 0.99, 1],
      maxAgeSeconds: 300,
      pruneAgedBuckets: true,
      ageBuckets: 1,
    });
    benchSummary(summary, ITERATIONS);
    break;
  }
  case "summary2": {
    const summary = new Summary({
      name: "test_metric_summary",
      help: "test_metric_summary",
      percentiles: [0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 1],
    });
    benchSummary(summary, ITERATIONS);
    break;
  }
  case "summary3": {
    const summary = new Summary({
      name: "test_metric_summary",
      help: "test_metric_summary",
      percentiles: [0.5, 0.95, 0.99],
    });
    benchSummary(summary, ITERATIONS);
    break;
  }
  case "histogram1": {
    const hist = new Histogram({
      name: "test_metric_hist",
      help: "test_metric_hist",
      buckets: [1, 10, 50, 100, 250, 500, 1000, 2000, 5000, 10000],
    });
    benchHistogram(hist, ITERATIONS);
    break;
  }
  case "histogram2": {
    const hist = new Histogram({
      name: "test_metric_hist",
      help: "test_metric_hist",
      buckets: [
        1, 10, 50, 100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000,
      ],
    });
    benchHistogram(hist, ITERATIONS);
    break;
  }
  case "histogram3": {
    const hist = new Histogram({
      name: "test_metric_hist",
      help: "test_metric_hist",
      buckets: [
        1, 10, 50, 100, 250, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000,
      ],
    });
    benchHistogram(hist, ITERATIONS);
    break;
  }
  default: {
    throw new Error("Invalid metric");
  }
}
