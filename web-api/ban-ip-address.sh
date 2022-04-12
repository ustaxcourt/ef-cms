#!/bin/bash

# This script adds an IP address to AWS WAF’s banned IP set, which blocks the IP
# from making requests to the public and private API endpoints.
#
# Usage:
#   ./ban-ip-address.sh [ENV] [IP]
#
# Examples:
#   ./ban-ip-address.sh prod 192.0.2.4
#   ./ban-ip-address.sh prod 2001:0db8:0000:0000:0000:0000:0000:0000
#
# Arguments:
#   ENV: the environment name
#   IP: the IP address in IPv4 or IPv6 format

ENV=$1
IP=$2

if [ -z "${ENV}" ]; then
  echo "Pass the environment name as the first argument. Exiting!"
  exit 1
fi

if [ -z "${IP}" ]; then
  echo "Pass an IPv4 or IPv6 address as the second argument. Exiting!"
  exit 1
fi

IPv4=$(echo "${IP}" | grep -Eoh "^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$")
IPv6=$(echo "${IP}" | grep -Eoh "^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$")

if [ -z "${IPv4}" ] && [ -z "${IPv6}" ]; then
  echo "Could not parse the IP address (${IP}) as either an IPv4 or IPv6"
  echo "address, exiting!"
  exit 1
fi

if [ -n "${IPv4}" ] && [ -n "${IPv6}" ]; then
  echo "Uh oh, parsed the IP address (${IP}) as both an IPv4 and IPv6 address."
  echo "This is a script bug, exiting!"
  exit 1
fi

if [ -n "${IPv4}" ]; then
  IP_SET_NAME="banned_ipv4_ips_${ENV}"
  IP_CIDR="${IPv4}/32"
else
  IP_SET_NAME="banned_ipv6_ips_${ENV}"
  IP_CIDR="${IPv6}/128"
fi

echo "You’re about to block this single IP address from accessing"
echo "the ${ENV} environment. That IP will still be able to access the"
echo "front-end application, but all API requests will be blocked."
echo

read -p "Block ${IP} now? (y/N) " -r
[[ ! $REPLY =~ ^[Yy]$ ]] && echo "Exiting." && exit 1

export AWS_PAGER=''

set -ex

for REGION in east west; do
  IP_SET_ID=$(aws wafv2 list-ip-sets --scope REGIONAL --region "us-${REGION}-1" --query "IPSets[?Name == '${IP_SET_NAME}'].Id" --output text)
  LOCK_TOKEN=$(aws wafv2 get-ip-set --scope REGIONAL --region "us-${REGION}-1" --name "${IP_SET_NAME}" --id "${IP_SET_ID}" --query "LockToken" --output text)
  CURRENT_ADDRESSES=$(aws wafv2 get-ip-set --scope REGIONAL --region "us-${REGION}-1" --name "${IP_SET_NAME}" --id "${IP_SET_ID}" --query "IPSet.Addresses" --output text)

  aws wafv2 update-ip-set --scope REGIONAL --region "us-${REGION}-1" --name "${IP_SET_NAME}" --id "${IP_SET_ID}" --lock-token "${LOCK_TOKEN}" --addresses "${CURRENT_ADDRESSES} ${IP_CIDR}"
done

set +x

echo
echo
echo "IP address ${IP} blocked in ${ENV} environment."
echo
