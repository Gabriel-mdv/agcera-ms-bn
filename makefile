
IMAGE_NAME := agceramoz/agcera-ms-bn
TAG := latest

build_image:
	docker build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} .

push_image:
	docker push ${IMAGE_NAME}:${TAG}
