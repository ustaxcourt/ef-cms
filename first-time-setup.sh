#!/bin/bash

# This script is intended for getting new devs up and running,
# checking to see if you have any of the CLI tools needed, and installing and updating as needed.
# Any issues, reach out to Ben Eccles on Teams.

# Check for Apple Silicon Mac
if [[ "$(uname)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
    echo "This script only supports Apple Silicon Macs. Exiting."
    exit 1
fi

# Check Git config
GIT_NAME=$(git config --global user.name)
GIT_EMAIL=$(git config --global user.email)

if [[ -z "$GIT_NAME" ]]; then
    read -rp "Enter your Git name: " GIT_NAME
    git config --global user.name "$GIT_NAME"
fi

if [[ -z "$GIT_EMAIL" ]]; then
    read -rp "Enter your Git email: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
fi

echo "Git configured as: $GIT_NAME <$GIT_EMAIL>"

if command -v brew &> /dev/null; then
    echo "Homebrew found: $(brew --version | head -n 1)"
else
    echo "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add to path permanently (Apple Silicon) if not already there
    if ! grep -q 'brew shellenv' ~/.zprofile 2>/dev/null; then
        # shellcheck disable=SC2016
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    fi
    
    # Also load it for current session
    eval "$(/opt/homebrew/bin/brew shellenv)"
    
    # Verify installation succeeded
    if ! command -v brew &> /dev/null; then
        echo "Homebrew installation failed. Exiting."
        exit 1
    fi

    echo "Homebrew installed successfully!"
fi

# Keep Mac awake for rest of setup
caffeinate -disu &
CAFFEINATE_PID=$!

# Update Homebrew
echo "Updating Homebrew..."
brew update

# Install CLI tools
echo "Installing CLI tools..."
brew install git \
    nvm \
    openjdk \
    jq \
    shellcheck \
    awscli \
    warrensbox/tap/tfswitch \
    circleci \
    oath-toolkit \
    libpq \
    gh

# NVM setup
if ! grep -q 'NVM_DIR' ~/.zshrc 2>/dev/null; then
    echo "Configuring NVM..."
    cat >> ~/.zshrc << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
EOF
fi

# Load NVM for current session
export NVM_DIR="$HOME/.nvm"
# Ignore needed here since the linter can't see outside of the repo
# shellcheck disable=SC1091
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"

# Install Node version from .nvmrc and set as default
echo "Installing Node version from .nvmrc..."
nvm install
# Sets default to .nvmrc file specified version
nvm alias default "$(cat .nvmrc)"

# OpenJDK setup
if ! grep -q 'openjdk' ~/.zshrc 2>/dev/null; then
    echo "Configuring OpenJDK..."
    echo "OpenJDK setup requires admin password..."
    sudo ln -sfn "$(brew --prefix openjdk)"/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
    # shellcheck disable=SC2016
    echo 'export PATH="$(brew --prefix openjdk)/bin:$PATH"' >> ~/.zshrc
fi

# libpq setup (for psql CLI)
if ! grep -q 'libpq' ~/.zshrc 2>/dev/null; then
    echo "Configuring libpq..."
    # shellcheck disable=SC2016
    echo 'export PATH="$(brew --prefix libpq)/bin:$PATH"' >> ~/.zshrc
fi

# Apple Silicon dependencies
echo "Apple Silicon detected. Installing additional dependencies..."
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman libffi expat zlib
brew link libffi --force
brew link expat --force
brew link zlib --force
echo "node-canvas dependencies installed!"

# Docker Desktop
echo "Installing Docker Desktop..."
brew install --cask docker

echo ""
echo "Please launch Docker Desktop from Applications and complete the setup."
echo "Press Enter when Docker is running..."
read -r

# Install project dependencies
echo "Installing project dependencies..."
npm ci

# Kill caffeinate when done
kill $CAFFEINATE_PID 2>/dev/null

echo "Setup complete!"