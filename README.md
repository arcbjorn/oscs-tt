# The Open Source Computer Science time tracker

## Front end & Back end

### Docker-Compose

```bash
# Clean up docker-compose environment:
# - remove local containers
# - remove named volumes declared in the compose file and anonymous volumes attached to containers
# - remove containers for services not defined in the compose file
$ docker-compose down --rmi local --volumes --remove-orphans

# Rebuild containers:
$ docker-compose build --no-cache

# Run the application in the development mode:
$ docker-compose up

# Also you can run only needed services:
$ docker-compose up <service_name1> <service_name2>

# View service logs:
$ docker-compose logs <service_name>

```

## Docker

Build, run and stop Server (back-end) service:

```bash
# Build docker image:
$ cd server
$ docker build --tag oscs-tt-server .

# Run container:
$ docker run --name oscs-tt-server --env-file .env --network="host" oscs-tt-server

# Stop and remove container:
$ docker rm --force oscs-tt-server
```

Build, run and stop Client service:

```bash
# Build docker image:
$ cd client
$ docker build --tag oscs-tt-client .

# Run container:
$ docker run --name oscs-tt-client --env-file .env --network="host" oscs-tt-client

# Stop and remove container:
$ docker rm --force oscs-tt-client
```

## Development

Setup development environment:

```sh
cd oscs-tt/server
# Docker-compose will install dependencies inside the container,
# but this step is required if you want to have graphql type generation,
# dev scripts and reach IDE features to work.
yarn
cp .env.sample .env
cd oscs-tt/server
yarn
cp .env.sample .env
```

Next check configuration at .env files and run the following commands:

```sh
cd oscs-tt
docker-compose up
```

### Generate custom Icon font from svg icons

Use Icomoon service: https://icomoon.io/app/
Import SVG icons by clicking on the button "import".
Select all the imported icons for the set and click "generate font".
Click button "download".
Open downloaded .zip file and move the content of "fonts" folder to the project /fe/src/assets/fonts.
