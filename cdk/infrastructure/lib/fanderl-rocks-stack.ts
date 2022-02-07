import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import { TargetTrackingScalingPolicy } from 'aws-cdk-lib/aws-applicationautoscaling';

export class FanderlRocksStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const subdomain = 'www';
    const domainName = 'fanderl.rocks';

    const root_logs_bucket = new s3.Bucket(this, 'fanderl_rocks_logs_bucket', {
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'fanderl-rocks-logs'
    });

    const root_bucket = new s3.Bucket(this, 'fanderl_rocks_domain_root_bucket', {
      versioned: false,
      bucketName: domainName,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      serverAccessLogsBucket: root_logs_bucket,
      serverAccessLogsPrefix: 'fanderl_rocks_root'
    });

    new s3Deployment.BucketDeployment(this, 'fanderl_rocks_static_website_content', {
      sources: [s3Deployment.Source.asset('../../content')],
      destinationBucket: root_bucket
    });

    const subdomain_bucket = new s3.Bucket(this, 'fanderl_rocks_subdomain_bucket', {
      versioned: false,
      bucketName: `${subdomain}.${domainName}`,
      websiteRedirect: {
        hostName: domainName
      }
    });

    const hosted_zone = route53.HostedZone.fromLookup(this, 'fanderl_rocks_hosted_zone', {domainName});

    new route53.ARecord(this, 'fanderl_rocks_root_a_record', {
      zone: hosted_zone,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(root_bucket))
    });
    
    new route53.ARecord(this, 'fanderl_rocks_subdmain_a_record', {
      zone: hosted_zone,
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(subdomain_bucket))
    });
  }
}
