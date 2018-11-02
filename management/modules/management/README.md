Sets-up an entire VPC with one public and one private subnet.  The public subnet contains a
- Jenkins instance.
- A bastion instance that will allow SSH access to the aforementioned instances.

Each of the instances will receive a domain name based on the input variable.

Usage:
```hcl
module "management" {
  source = "git@github.com:flexion/flexion-terraform//management"

  dns_domain = "prototype.flexion.us"

  ssh_cidrs = [
    "75.100.125.78/32", # Flexion office
  ]
}
```


## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| dns_domain | The domain name that all other services will be based upon. For example, "prototype.flexion.us". There must be a Route53 hosted zone with that domain name. | string | - | yes |
| ssh_cidrs | A list of CIDRs that will be allowed SSH access to the bastion host. | string | `<list>` | no |
