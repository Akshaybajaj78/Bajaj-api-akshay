# Stage 1: Build the React frontend
FROM node:20 AS build
WORKDIR /app/frontend

# Prevent out of memory errors during Vite build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install frontend dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Build frontend
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Express backend and serve the app
FROM node:18-alpine
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from the previous stage
COPY --from=build /app/frontend/dist /app/frontend/dist

# Expose port and start
EXPOSE 3000
CMD ["node", "server.js"]
