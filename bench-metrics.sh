#!/bin/bash

hyperfine \
 --max-runs 10 \
 --warmup 1 \
 --parameter-list metric summary1,summary2,summary3,histogram1,histogram2,histogram3 \
 --parameter-list num_iters 1e6 \
 'node metrics.mjs {metric} {num_iters}'
