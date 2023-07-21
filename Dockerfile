FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies

COPY package*.json ./

RUN npm install


# Bundle app source
COPY . .

# 3000 default if no port specified in .env file
ARG PORT=3000
EXPOSE ${PORT}



CMD [ "npm", "start" ]