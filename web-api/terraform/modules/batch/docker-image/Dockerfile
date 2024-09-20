# Use Node.js 20 as the base image
FROM node:20

# Install AWS CLI
RUN apt-get update && \
	apt-get install -y awscli && \
	apt-get clean

# Define build arguments that will accept values at build time
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Set the environment variables using the passed build arguments
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Ensure ts-node is installed globally
RUN npm install -g ts-node typescript

# Expose a port if needed (optional, e.g., for web servers)
# EXPOSE 3000

# Define the command to run the TypeScript script
CMD ["ts-node", "src/testScript.ts"]
