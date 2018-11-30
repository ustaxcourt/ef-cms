# Adding Swap
If you notice any issues with the Jenkins box, it may be related to the lack of swap.  By default, EC2 instance do not have any swap.  To add some swap, ssh into the Jenkins box and run the following:

- `sudo su -`
- `dd if=/dev/zero of=/root/bigswap bs=1M count=4096`
- `chmod 600 /root/bigswap`
- `mkswap /root/bigswap`
- `swapon /root/bigswap`
- `echo "/root/bigswap swap swap defaults 0 0" >> /etc/fstab`