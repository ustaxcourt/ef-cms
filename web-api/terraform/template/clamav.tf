
# Flow: S3 -> Event Notification -> SQS -> EC2 Consumption & Scan -> tag


resource "aws_s3_bucket" "clamav_s3_download" {
  bucket = "${var.dns_domain}-monitor-script"
  acl    = "private"
}

resource "aws_s3_bucket_object" "clamav_worker_object" {
  bucket = aws_s3_bucket.clamav_s3_download.id
  key    = "worker.js"
  source = "worker.js"
  etag   = filemd5("worker.js")
}

resource "aws_s3_bucket_public_access_block" "clamav" {
  bucket                  = aws_s3_bucket.clamav_s3_download.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "quarantine_bucket" {
  bucket = "${var.dns_domain}-quarantine"
}

# SQS
resource "aws_sqs_queue" "clamav_event_queue" {
  name = "s3_clamav_event_${var.environment}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["sqs:SendMessage", "sqs:ReceiveMessage"],
      "Resource": "arn:aws:sqs:*:*:s3_clamav_event_${var.environment}",
      "Condition": {
        "ArnEquals": { "aws:SourceArn": "${aws_s3_bucket.quarantine_bucket.arn}" }
      }
    }
  ]
}
POLICY
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.quarantine_bucket.id

  queue {
    queue_arn = aws_sqs_queue.clamav_event_queue.arn
    events    = ["s3:ObjectCreated:*"]
  }
}

# EC2
resource "aws_instance" "clamav_worker" {
  ami           = "ami-0a313d6098716f372"
  instance_type = "t2.large"

  availability_zone = "us-east-1a"

  tags = {
    Name        = "clamav-${var.environment}"
    environment = var.environment
  }

  user_data = data.template_file.setup_clamav.rendered

  iam_instance_profile = "clamav_s3_download_instance_profile_${var.environment}"

  key_name = "cody for clamav"
}

data "template_file" "setup_clamav" {
  template = file("setup_clamav_worker.sh")

  vars = {
    documents_bucket_name  = aws_s3_bucket.documents_us_east_1.id
    sqs_queue_url          = aws_sqs_queue.clamav_event_queue.id
    quarantine_bucket      = aws_s3_bucket.quarantine_bucket.id
    environment            = var.environment
    monitor_script_s3_path = "${var.dns_domain}-monitor-script"
  }
}
