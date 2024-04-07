
IMAGE_NAME := agceramoz/agcera-ms-bn
TAG := latest

build:
	docker build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} .