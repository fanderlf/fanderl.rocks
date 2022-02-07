import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'

export class FanderlRocksStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const root_logs_bucket = new s3.Bucket(this, 'fanderl_rocks_logs_bucket', {
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'fanderl-rocks-logs'
    })

    const root_bucket = new s3.Bucket(this, 'fanderl_rocks_domain_root_bucket', {
      versioned: false,
      bucketName: 'fanderl.rocks',
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      serverAccessLogsBucket: root_logs_bucket,
      serverAccessLogsPrefix: 'fanderl_rocks_root'
    })

    new s3Deployment.BucketDeployment(this, 'fanderl_rocks_static_website_content', {
      sources: [s3Deployment.Source.asset('../../content')],
      destinationBucket: root_bucket
    })

    new s3.Bucket(this, 'fanderl_rocks_subdomain_bucket', {
      versioned: false,
      bucketName: 'www.fanderl.rocks',
      websiteRedirect: {
        hostName: 'fanderl.rocks'
      }
    })
  }
}
