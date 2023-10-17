variable "s3_bucket_names" {
  type = list(any)
  default = [
    "commapp-blob",
  ]
}

resource "aws_s3_bucket" "comm_buckets" {
  count         = length(var.s3_bucket_names)
  bucket        = "${var.s3_bucket_names[count.index]}${var.bucket_name_suffix}"
  force_destroy = var.is_dev ? true : false
}
