# Use latest Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Expose server port
EXPOSE 5000

# Start the development server
CMD ["npm", "run", "dev"]
