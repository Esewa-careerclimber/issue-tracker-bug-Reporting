# Use latest Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all source files first (needed for install)
COPY . .

# Install dependencies with clean slate
RUN rm -rf node_modules package-lock.json && npm install

# Expose React dev server port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
