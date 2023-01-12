
build:
	yarn build

start: build
	pm2 startOrRestart ecosystem.config.js



