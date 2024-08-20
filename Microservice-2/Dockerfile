FROM node:latest

WORKDIR /app

# Copy the rest of the source files into the image.
COPY . .

RUN npm install

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD node server.js