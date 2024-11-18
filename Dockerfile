# Step 1: Use the official Node.js image to build the application
FROM node:18 AS build
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React application for production
RUN npm run build

# Step 2: Use the official Nginx image to serve the built application
FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy the build output from the previous stage
COPY --from=build /app/build .

# Expose the default Nginx HTTP port
EXPOSE 80

# Start Nginx server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
