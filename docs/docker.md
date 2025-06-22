```
docker build -t dumpstore-backend .
docker run --rm -it -p 3008:3008 --env-file .env dumpstore-backend

docker tag dumpstore-backend manzilrahul/dumpstore-backend:0.0.1
docker push manzilrahul/dumpstore-backend:0.0.1
```
---

```
docker build -t dumpstore-frontend .
docker run --rm -p 5173:5173 --env-file .env dumpstore-frontend

docker tag dumpstore-frontend manzilrahul/dumpstore-frontend:0.0.1
docker push manzilrahul/dumpstore-frontend:0.0.1
```