# Use latest Node LTS
FROM node:20-alpine

# Install curl for healthcheck
RUN apk --no-cache add curl

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy all source files first (needed for install)
COPY . .

# Install dependencies with clean slate
RUN rm -rf node_modules package-lock.json && npm install

# Expose server port
EXPOSE 5000

# Start the development server
CMD ["npm", "run", "dev"]
