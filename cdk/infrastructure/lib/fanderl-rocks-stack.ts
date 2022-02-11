import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'

export class FanderlRocksStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const region = props?.env?.region || "";
    const account = props?.env?.account || ""; // fails if it is not set
    const subdomain = 'www';
    const domainName = 'fanderl.rocks';
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${this.stackName}`
    });

    const root_bucket = new s3.Bucket(this, 'fanderl_rocks_domain_root_bucket', {
      versioned: false,
      bucketName: domainName,
      websiteIndexDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    root_bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [root_bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    const wwwFullDomainName = `${subdomain}.${domainName}`;
    const subdomain_bucket = new s3.Bucket(this, 'fanderl_rocks_subdomain_bucket', {
      versioned: false,
      bucketName: wwwFullDomainName,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: 'index.html'
    });

    subdomain_bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [subdomain_bucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    new s3Deployment.BucketDeployment(this, 'fanderl_rocks_static_website_content', {
      sources: [s3Deployment.Source.asset('../../content')],
      destinationBucket: root_bucket
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'fanderl_rocks_hosted_zone', { domainName });

    const certificate = new certificatemanager.DnsValidatedCertificate(
      this,
      "fanderl_rocks_tls_certificate",
      {
        domainName: wwwFullDomainName,
        hostedZone: hostedZone,
        region: "us-east-1"  // this needs to us-east-1, otherwise the certifcate can't be used in cloudfront
      }
    )

    const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate({
      certificateArn: certificate.certificateArn,
      env: {
        region,
        account
      },
      node: this.node,
      stack: this,
      metricDaysToExpiry: () =>
        new cloudwatch.Metric({
          namespace: "TLS Viewer Certificate Validity",
          metricName: "TLS Viewer Certificate Expired",
        }),
      applyRemovalPolicy: () => RemovalPolicy.DESTROY
    }, {
      sslMethod: cloudfront.SSLMethod.SNI,
      securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      aliases: [wwwFullDomainName]
    })

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'fanderlf_rocks_cloudfront_distribution', {
      viewerCertificate,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: subdomain_bucket,
            originAccessIdentity: cloudfrontOAI
          },
          behaviors: [{
            compress: true,
            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
            isDefaultBehavior: true,
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
          }]
        }
      ]
    })

    new s3Deployment.BucketDeployment(this, 'fanderl_rocks_static_website_subdomain_content', {
      sources: [s3Deployment.Source.asset('../../content')],
      destinationBucket: subdomain_bucket,
      distribution: distribution,
      distributionPaths: ['/*']
    });

    new route53.ARecord(this, 'fanderl_rocks_subdmain_a_record', {
      zone: hostedZone,
      recordName: wwwFullDomainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });

  }
}
