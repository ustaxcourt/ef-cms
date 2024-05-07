migration "state" "test" {
  dir = "."
  actions = [
    "mv aws_sqs_queue.rename_queue module.sqs_queue_mod.aws_sqs_queue.rename_queue",
  ]
}
