# Use an official OpenJDK runtime as a base image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the JAR file built by Maven to the working directory
COPY target/monitoring-0.0.1-SNAPSHOT.jar ./

# Expose the port your application will listen on
EXPOSE 8082

# Define the command to start your application
CMD ["java", "-jar", "monitoring-0.0.1-SNAPSHOT.jar"]