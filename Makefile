# 🖼️ Logo banner
define ascii_banner
	@cat ./utils/banner.txt
endef

# --------------------
# 💻 Local Development
# --------------------

run-backend:
	$(call ascii_banner)
	@echo "▶️  Running backend app locally..."
	cd backend && npm run dev

run-frontend:
	$(call ascii_banner)
	@echo "▶️  Running frontend app locally..."
	cd frontend && npm run dev

# --------------------
# ⚙️ Build Steps
# --------------------

build-backend:
	$(call ascii_banner)
	@echo "🛠️  Building backend..."
	cd backend && npm run build

build-frontend:
	$(call ascii_banner)
	@echo "🛠️  Building frontend..."
	cd frontend && npm run build

# --------------------
# 🐳 Docker Compose
# --------------------

up:
	$(call ascii_banner)
	@echo "📦 Starting Docker Compose..."
	docker-compose up --build

down:
	$(call ascii_banner)
	@echo "🛑 Stopping Docker Compose..."
	docker-compose down

# --------------------
# 🧪 Docker Build + Run Individually
# --------------------

docker-build-backend:
	docker build -t dumpstore-backend ./backend

docker-build-frontend:
	docker build -t dumpstore-frontend ./frontend

docker-run-backend:
	docker run --rm -it --env-file ./backend/.env -p 5000:5000 dumpstore-backend

docker-run-frontend:
	docker run --rm -it -p 5173:5173 dumpstore-frontend

# --------------------
# 🧪 Docker Push + Run Individually
# --------------------

docker-push-backend:
	docker push manzilrahul/dumpstore-backend:0.0.1

docker-push-frontend:
	docker push manzilrahul/dumpstore-frontend:0.0.1

# --------------------
# 🧹 Utility
# --------------------

clean:
	@echo "🧹 Cleaning dist folders..."
	rm -rf backend/dist frontend/dist

.PHONY: run-backend run-frontend build-backend build-frontend up down docker-build-backend docker-build-frontend docker-run-backend docker-run-frontend clean
