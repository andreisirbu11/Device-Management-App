# Use an official Node.js image as a base
FROM node:21.1.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if applicable) to the working directory
COPY package*.json ./

# Copy the rest of the application files to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use a smaller base image to serve the app
FROM nginx:alpine

# Copy the built React app from the build stage
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose the default HTTP port for the Nginx server
EXPOSE 80

# The Nginx container will automatically start serving the app
