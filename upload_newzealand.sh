#!/bin/bash
aws s3 sync ./content/neuseeland/ s3://www.fanderl.rocks/neuseeland/
aws cloudfront create-invalidation --distribution-id <cloudfront-distribution-id> --paths '/*'
