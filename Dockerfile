# Stage 1: Build Stage
FROM node:20.12-alpine3.19 AS build

# Install build tools and Python for bcrypt and node-gyp (needed for dependencies)
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set the working directory in the container
WORKDIR /App

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install all dependencies (including dev dependencies like nodemon)
RUN npm install

# Copy the rest of the application files
COPY . .

# Stage 2: Final Stage (Runtime Image)
FROM node:20.12-alpine3.19

# Set the working directory in the container
WORKDIR /App

# Copy only the necessary files from the build stage
COPY --from=build /App /App

# Expose the application port
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production

# Use nodemon to start the application in dev mode with auto-reloading
CMD ["npm", "run", "dev"]
