# Setting up a DAWSON development environment in Windows

## Install Software

### Install Debian via WSL

1. Run PowerShell as an administrator
1. Install Debian
   ```powershell
   wsl --install -d Debian
   ```
1. Reboot your machine to install the virtualization subsystem. (Go get a sandwich, it takes a while)
1. After reboot, you will be asked to configure the local (linux) user with a username and password

### Install GUI Software

1. Download and install [TablePlus](https://tableplus.com)
1. Download and install [VSCode](https://code.visualstudio.com)
   1. Also install the [WSL plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) for VSCode


### Install and Configure CLI Software

__Tips before you begin__

- To copy highlighted text from the terminal: `CTRL`+`SHIFT`+`C`
- To paste text from your clipboard in the terminal: `CTRL`+`SHIFT`+`V`

__Ready to begin? Let's go!__

1. Start the Debian WSL container and enter the shell
1. Sync the list of available packages
   ```bash
   sudo apt update
   ```
1. Upgrade all existing software
   ```bash
   sudo apt full-upgrade
   ```
1. Install `zsh`
   ```bash
   sudo apt install zsh zplug
   ```
1. Configure `zsh` as your user's default login shell
   ```bash
   chsh -s $(which zsh)
   ```
1. Exit the shell
   ```bash
   exit
   ```
1. Launch Debian again and enter the shell, which will now be a `zsh` session
1. Delete the automatically generated config file
   ```bash
   rm ~/.zshrc
   ```
1. Create a new `.zshrc` config file (paste the following as a single command)
   ```bash
   cat > ~/.zshrc << EOF
   # set the default language
   export LANG=en_US.UTF-8
   
   # set nano as the default CLI editor
   export EDITOR=nano
   export VISUAL="$EDITOR"
   
   # add the private bin to the PATH
   if [ -d "$HOME/bin" ] ; then
     path+=("$HOME/bin")
   fi
   if [ -d "$HOME/.local/bin" ] ; then
     path+=("$HOME/.local/bin")
   fi
   
   # set up the ustc-devops aliases
   if [ -f "$HOME/git/ustaxcourt/ustc-devops/dotfiles/.local/conf/aliases.zsh" ]; then
     source "$HOME/git/ustaxcourt/ustc-devops/dotfiles/.local/conf/aliases.zsh"
   fi
   
   # add the ustc-devops bin to the path
   if [ -d "$HOME/git/ustaxcourt/ustc-devops/dotfiles/.local/bin" ]; then
     path+=("$HOME/git/ustaxcourt/ustc-devops/dotfiles/.local/bin")
   fi
   
   # set up JAVA
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   
   # set circleci environment vars
   export CIRCLE_PROJECT_SLUG="github/ustaxcourt/ef-cms"
   export CIRCLE_PERSONAL_TOKEN=""
   
   export PATH
   EOF
   ```
1. Create a private `bin` directory in the home directory
   ```bash
   mkdir -p ~/bin
   ```
1. Create a private `bin` directory in `~/.local`
   ```bash
   mkdir -p ~/.local/bin
   ```
1. Source the `.zshrc` config file to apply the configuration
   ```bash
   source ~/.zshrc
   ```
1. Install software (paste the following as a single command)
   ```bash
   sudo apt-get install \
     2to3 \
     awscli \
     build-essential \
     chromium \
     chromium-driver \
     curl \
     docker.io \
     docker-compose \
     gh \
     ghostscript \
     git \
     graphicsmagick \
     jq \
     less \
     libcairo2-dev \
     libgif-dev \
     libjpeg-dev \
     libpango1.0-dev \
     librsvg2-dev \
     openjdk-17-jdk \
     openjdk-17-jdk-headless \
     openjdk-17-jre \
     openjdk-17-jre-headless \
     openssh-client \
     postgresql-client \
     python-is-python3 \
     python-dev-is-python3 \
     python3 \
     python3-dev \
     python3-pip \
     sudo \
     wget \
     zip
   ```
1. Install NVM by following the [NVM installation instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
1. Source the `.zshrc` config file to enable the NVM configuration that was automatically appended during installation
   ```bash
   source ~/.zshrc
   ```
1. Install NodeJS via `nvm`
   1. To find out which version of NodeJS to install, check the `FROM` line of the [Dockerfile](../Dockerfile) and look for `node-<version>`
   1. Install NodeJS, replacing `<version>` with the actual version you determined
      ```bash
      nvm install <version>
      ```
   1. Set the local version of NodeJS to the version you just installed
      ```bash
      nvm use <version>
      ```
   1. **Note:** You will be responsible for keeping your local installation of NodeJS in sync with DAWSON's by repeating the previous two steps when necessary 
1. Install `tfswitch` by following the [tfswitch installation instructions](https://github.com/warrensbox/terraform-switcher#linux)
1. Install Terraform via `tfswitch`
   1. To find out which version of Terraform to install, check the [verify-terraform-version](../scripts/verify-terraform-version.sh) script
   1. Use `tfswitch` to install Terraform, replacing `<version>` with the actual version you determined
      ```bash
      tfswitch <version>
      ```
   1. **Note:** You will be responsible for keeping your local installation of Terraform in sync with DAWSON's by repeating the previous step when necessary
1. Configure `git`
   1. Configure `git` to use your github user (be sure to use the email address you use with github)
      ```bash
      git config --global user.email "first.last@ustaxcourt.gov"
      ```
   1. Generate an SSH key (press `Enter` to select all the defaults when asked)
      ```bash
      ssh-keygen -b 4096
      ```
   1. Output the contents of the public key on the terminal
      ```bash
      cat ~/.ssh/id_rsa.pub
      ```
   1. Select the public key and copy it to your clipboard with `CTRL`+`SHIFT`+`C`
   1. In your browser, navigate to [https://github.com/settings/keys](https://github.com/settings/keys)
   1. Log in (if necessary) and click the "New SSH Key" button
   1. Paste the contents of your public key into the "Key" text area
   1. The "Name" field should be automatically populated from the name embedded in your key, but if it wasn't, give this SSH key a name
   1. Click the "Add SSH Key" button
   1. Back in your terminal, connect to github using the SSH key, answering "yes" when asked if you trust the connection
      ```bash
      ssh -T git@github.com
      ```
1. Prepare your `git` directory structure
   1. Create the directories
      ```bash
      mkdir -p ~/git/ustaxcourt
      ```
   1. Enter the directory you created for `ustaxcourt` repositories
      ```bash
      cd ~/git/ustaxcourt
      ```
   1. Clone the `ef-cms` repository
      ```bash
      git clone -b staging git@github.com:ustaxcourt/ef-cms.git
      ```
   1. Clone the `ustc-devops` repository
      ```bash
      git clone git@github.com:ustaxcourt/ustc-devops.git
      ```
1. Source the `.zshrc` config file to enable the `ustc-devops` aliases
   ```bash
   source ~/.zshrc
   ```
1. Open the `ef-cms` directory in VSCode (this step will only work if you've already installed the [WSL plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) for VSCode and restarted the Linux container after doing so)
   ```bash
   code ~/git/ustaxcourt/ef-cms
   ```
1. Follow the [environment switcher setup instructions](./additional-resources/environment-switcher.md) to set up AWS SSO and configure your environment switcher to be able to point to deployed DAWSON environments
1. Follow the instructions for [Connecting to a Deployed Postgres Database](./postgres/connect-to-deployed-db.md) to configure TablePlus to connect to the deployed postgres databases
