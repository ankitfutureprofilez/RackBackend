# Use an official Node.js runtime as the base image
FROM node:18-slim

# Install build tools and Python for bcrypt and node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /App

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --build-from-source

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8080

# Set environment variables for production
ENV NODE_ENV=production

# Define the command to run the application
CMD ["npm", "run", "dev"]
