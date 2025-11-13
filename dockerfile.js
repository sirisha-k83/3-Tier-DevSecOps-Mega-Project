# Base image with Node.js
# Base image with Node.js
FROM node:22.0.0

WORKDIR /app

# 1. Copy both API and CLIENT package files into their correct subdirectories.
# This prepares the environment for installing dependencies for each module.
COPY api/package*.json ./api/
COPY client/package*.json ./client/

# 2. Install dependencies for the client and API
# Note: npm ci is preferred over npm install for CI/CD environments
RUN npm ci --prefix api
RUN npm ci --prefix client

# 3. Copy all remaining source code
COPY api/ ./api
COPY client/ ./client

# 4. Build the client (if it produces static assets)
RUN npm run build --prefix client

# 5. Expose ports
EXPOSE 3000
EXPOSE 5000

# 6. Run the API application. 
# This command assumes the API server will handle serving the built client files.
# If your API start script is in the 'api' directory, you must explicitly call it.
CMD ["npm", "start", "--prefix", "api"]