FROM node:16.14 AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /api

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY yarn.lock ./
COPY package*.json ./

# Here we install all the deps
RUN yarn install

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN yarn run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:16.14 AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /api

# Copy all from development stage
COPY --from=development /api .

EXPOSE 9000

# Run app
CMD [ "node", "dist/main" ]