start:
	docker compose up --build

stop:
	docker compose down

restart:
	docker compose down && docker compose up --build

logs:
	docker compose logs -f backend

migrate:
	docker compose exec backend npx prisma migrate dev --name init

generate:
	docker compose exec backend npx prisma generate

studio:
	docker compose exec backend npx prisma studio

build:
    docker buildx build --platform linux/amd64,linux/arm64 -t zhlnv/abramov-repo:latest -f Dockerfile.prod --push .