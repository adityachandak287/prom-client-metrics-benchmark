# Prom Client Benchmarks

## Requirements

- node.js
- hyperfine: https://github.com/sharkdp/hyperfine

## Run benchmarks

`bench-metrics.sh` runs a `hyperfine` command which runs `metrics.mjs` with various inputs and compares the the time taken by each input command.

Feel free to tinker with either of the scripts.

```shell
bash bench-metrics.sh
```

Refer to [result.log](result.log) for example output.
