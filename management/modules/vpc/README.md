Sets-up an entire VPC with the specified number of public and private subnets spread across the availability zones.
The public subnets all have internet access through one internet gateway.
The private subnets all have internet access through one NAT gateway associated with the first
public subnet.

Usage:
```hcl
module "vpc" {
  source = "git@github.com:flexion/flexion-terraform//vpc"

  environment = "production"

  number_of_subnets = 3
}
```


## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| environment | An environment name to tag all the resources with. | string | - | yes |
| number_of_subnets | The number of public and private subnets to create in the VPC. For example, "2" creates two public and two private subnets. | string | `1` | no |

## Outputs

| Name | Description |
|------|-------------|
| private_subnets | A list of IDs of the private subnets created. |
| public_subnets | A list of IDs of the public subnets created. |
| vpc_id | The ID of the VPC created. |
