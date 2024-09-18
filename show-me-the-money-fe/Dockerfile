# Use an official node image as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Use a different image for serving the production build
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build files from the previous stage
COPY --from=build /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose port 3001
EXPOSE 3001

# Command to serve the build
CMD ["serve", "-s", "build", "-l", "3001"]