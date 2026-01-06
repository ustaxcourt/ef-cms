#!/bin/bash

# This script uses Homebrew to manage CLI tools and dependencies.
# Learn more about Homebrew at https://brew.sh

# This script is intended for getting new devs up and running,
# checking to see if you have any of the CLI tools needed, and installing and updating as needed.
# Any issues? open an issue on GitHub and tag @ben-eccles-gunnison.
# For USTC Internal Devs, you can find me on Teams.

# Exit on error (be careful with conditionals)
set -e

# Function to add to PATH only if not already present
add_to_path() {
    if [[ ":$PATH:" != *":$1:"* ]]; then
        export PATH="$1:$PATH"
    fi
}

# Check for Apple Silicon Mac
# uname in shell will give you the OS name, and adding the -m gives the
# machine hardware name (the architecture name for the CPU).
if [[ "$(uname)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
    echo "This script only supports Apple Silicon Macs. Exiting."
    exit 1
fi

# Verify we're in project root, the whole point of this
# is to give you a 'one-command' setup option.
if [ ! -f ".nvmrc" ] || [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    echo "Missing .nvmrc or package.json"
    exit 1
fi

# Check Git config
GIT_NAME=$(git config --global user.name)
GIT_EMAIL=$(git config --global user.email)

if [[ -z "$GIT_NAME" ]]; then
    read -rp "Enter your Git name: " GIT_NAME
    git config --global user.name "$GIT_NAME"
else 
    echo "Git username detected, skipping."
fi

if [[ -z "$GIT_EMAIL" ]]; then
    read -rp "Enter your Git email: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
else
    echo "Git email detected, skipping."
fi

echo "Git configured as: $GIT_NAME <$GIT_EMAIL>"

# Check for brew, and if it's not installed download it.
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

# Cleanup caffeinate on exit
trap 'kill $CAFFEINATE_PID 2>/dev/null' EXIT

# Update Homebrew
echo "Updating Homebrew (this may take a minute)..."
brew update || echo "Warning: Homebrew update failed, continuing anyway..."

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

# Verify critical tools installed
echo "Verifying installations..."
FAILED_INSTALLS=()
for tool in git nvm openjdk jq awscli; do
    if ! command -v "$tool" &> /dev/null && ! brew list "$tool" &> /dev/null 2>&1; then
        FAILED_INSTALLS+=("$tool")
    fi
done

if [ ${#FAILED_INSTALLS[@]} -gt 0 ]; then
    echo "Warning: The following tools may not have installed correctly: ${FAILED_INSTALLS[*]}"
    read -rp "Continue anyway? (y/n): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# NVM setup (Path is different from website download version of NVM, thanks to installing via brew)
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
REQUIRED_VERSION=$(cat .nvmrc)
CURRENT_VERSION=$(nvm current 2>/dev/null || echo "none")

if [[ "$CURRENT_VERSION" != "v$REQUIRED_VERSION"* ]]; then
    echo "Installing Node version $REQUIRED_VERSION from .nvmrc..."
    nvm install
    nvm alias default "$REQUIRED_VERSION"
else
    echo "Node $REQUIRED_VERSION already installed, skipping..."
fi

# OpenJDK setup
if ! grep -q 'openjdk' ~/.zshrc 2>/dev/null; then
    echo "Configuring OpenJDK..."
    echo "OpenJDK setup requires admin password..."
    sudo ln -sfn "$(brew --prefix openjdk)"/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
    # shellcheck disable=SC2016
    echo 'export PATH="$(brew --prefix openjdk)/bin:$PATH"' >> ~/.zshrc
    
    # Also export for current session - declare and assign separately
    OPENJDK_PATH="$(brew --prefix openjdk)/bin"
    add_to_path "$OPENJDK_PATH"
else
    echo "OpenJDK already configured, skipping..."
    # Still export for current session if not already in PATH
    OPENJDK_PATH="$(brew --prefix openjdk)/bin"
    add_to_path "$OPENJDK_PATH"
fi

# libpq setup (for psql CLI)
if ! grep -q 'libpq' ~/.zshrc 2>/dev/null; then
    echo "Configuring libpq..."
    # shellcheck disable=SC2016
    echo 'export PATH="$(brew --prefix libpq)/bin:$PATH"' >> ~/.zshrc
    
    # Also export for current session - declare and assign separately
    LIBPQ_PATH="$(brew --prefix libpq)/bin"
    add_to_path "$LIBPQ_PATH"
else
    echo "libpq already configured, skipping..."
    # Still export for current session if not already in PATH
    LIBPQ_PATH="$(brew --prefix libpq)/bin"
    add_to_path "$LIBPQ_PATH"
fi

# Apple Silicon dependencies
echo "Apple Silicon detected. Installing additional dependencies..."
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman libffi expat zlib
brew link libffi --force
brew link expat --force
brew link zlib --force
echo "node-canvas dependencies installed!"

# Docker Install
if [ ! -d "/Applications/Docker.app" ]; then
    echo "Installing Docker..."
    brew install --cask docker --adopt
    
    echo ""
    echo "Please launch Docker Desktop from Applications and complete the setup."
    echo "Press Enter when Docker is running..."
    read -r
    
    # Verify Docker is running
    until docker info &> /dev/null; do
        echo "Docker is not running yet. Please start it and press Enter..."
        read -r
    done
    echo "Docker verified running!"
else
    echo "Docker already installed, checking if running..."
    if docker info &> /dev/null; then
        echo "Docker is running!"
    else
        echo ""
        echo "Docker is installed but not running."
        echo "Please launch Docker Desktop and press Enter when it's running..."
        read -r
        
        # Verify Docker is running
        until docker info &> /dev/null; do
            echo "Docker is not running yet. Please start it and press Enter..."
            read -r
        done
        echo "Docker verified running!"
    fi
fi

# Chrome Install
if [ ! -d "/Applications/Google Chrome.app" ]; then
    echo "Installing Chrome..."
    brew install --cask google-chrome --adopt
else
    echo "Chrome already installed, skipping..."
fi

# Pop App Install
if [ ! -d "/Applications/Pop.app" ]; then
    echo ""
    echo "Pop is a paired programming app required for internal developers."
    echo "Researchers and external contributors can skip this."
    read -rp "Would you like to install Pop? (y/n): " INSTALL_POP
    
    if [[ "$INSTALL_POP" =~ ^[Yy]$ ]]; then
        echo "Installing Pop..."
        brew install --cask pop-app --adopt
    else
        echo "Skipping Pop installation."
    fi
else
    echo "Pop already installed, skipping..."
fi

# Install project dependencies
echo "Installing project dependencies..."
npm ci

echo ""
echo "================================"
echo "Setup complete!"
echo "================================"
echo ""

# PATH Verification
echo "================================"
echo "Verifying PATH Configuration"
echo "================================"
echo ""

# Function to check if a path exists in PATH
path_exists() {
    local search_path="$1"
    echo "$PATH" | tr ':' '\n' | grep -q "^${search_path}$"
}

# Function to count occurrences of a path in PATH
count_path_occurrences() {
    local search_path="$1"
    echo "$PATH" | tr ':' '\n' | grep -c "^${search_path}$"
}

# Function to check and report on a path
check_path() {
    local path_name="$1"
    local path_value="$2"
    local count
    
    if path_exists "$path_value"; then
        count=$(count_path_occurrences "$path_value")
        if [ "$count" -gt 1 ]; then
            echo "⚠️  $path_name: FOUND ($count times - DUPLICATE!)"
        else
            echo "✅ $path_name: Found"
        fi
    else
        echo "❌ $path_name: NOT FOUND"
    fi
}

# Check key paths
check_path "Homebrew" "/opt/homebrew/bin"

if brew list openjdk &> /dev/null 2>&1; then
    OPENJDK_CHECK="$(brew --prefix openjdk)/bin"
    check_path "OpenJDK" "$OPENJDK_CHECK"
fi

if brew list libpq &> /dev/null 2>&1; then
    LIBPQ_CHECK="$(brew --prefix libpq)/bin"
    check_path "libpq" "$LIBPQ_CHECK"
fi

if [ -n "$NVM_DIR" ]; then
    NVM_NODE_PATH="$NVM_DIR/versions/node/$(nvm current 2>/dev/null || echo 'none')/bin"
    if [ -d "$NVM_NODE_PATH" ]; then
        check_path "NVM Node" "$NVM_NODE_PATH"
    fi
fi

echo ""

# Check for any duplicates
DUPLICATES=$(echo "$PATH" | tr ':' '\n' | sort | uniq -d)

if [ -z "$DUPLICATES" ]; then
    echo "✅ No duplicate paths detected in PATH"
else
    echo "⚠️  WARNING: Found duplicate paths in PATH:"
    echo "$DUPLICATES" | while IFS= read -r dup; do
        dup_count=$(count_path_occurrences "$dup")
        echo "  • $dup (appears $dup_count times)"
    done
    echo ""
    echo "This may indicate previous setup runs. Consider cleaning ~/.zshrc"
fi

echo ""
echo "================================"
echo "Installed Tool Versions"
echo "================================"
echo "Git:    $(git --version 2>/dev/null || echo 'not found')"
echo "Node:   $(node --version 2>/dev/null || echo 'not found')"
echo "npm:    $(npm --version 2>/dev/null || echo 'not found')"
echo "Java:   $(java -version 2>&1 | head -n 1 || echo 'not found')"
echo "psql:   $(psql --version 2>/dev/null || echo 'not found')"
echo "AWS:    $(aws --version 2>/dev/null || echo 'not found')"
echo "Docker: $(docker --version 2>/dev/null || echo 'not found')"

echo ""
echo "✅ All tools are ready to use in this terminal session."
echo ""
read -rp "Would you like to reload your shell config for future sessions? (y/n): " RELOAD_CONFIG

if [[ "$RELOAD_CONFIG" =~ ^[Yy]$ ]]; then
    # shellcheck disable=SC1090
    source ~/.zshrc
    echo "✅ Shell config reloaded!"
fi

echo ""
echo "Note: New terminal windows will automatically load these changes."
echo ""
echo "INTERNAL DEVS: Reach out to your Tech Lead for next steps."