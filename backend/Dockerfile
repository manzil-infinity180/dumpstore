# Official Image using node 20 alphine
FROM node:20-alpine

# working directory 
WORKDIR /backend

# Changes in package* . json file 
COPY package*.json ./
RUN rm -rf node_modules package-lock.json

# Install dependencies using npm ci for faster, consistent installs
RUN npm install
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# expose the app on port 3008
EXPOSE 3008

# Start the server
CMD ["node", "dist/server.js"]