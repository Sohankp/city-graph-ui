# Use Node.js image to build the app
FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Add custom nginx config (if needed)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
