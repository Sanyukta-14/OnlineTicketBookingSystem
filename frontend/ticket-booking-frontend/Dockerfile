# =========================================================
# STEP 1: BUILD REACT APPLICATION
# =========================================================

FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY . .

# Build Vite application
RUN npm run build


# =========================================================
# STEP 2: SERVE REACT APPLICATION
# =========================================================

FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]