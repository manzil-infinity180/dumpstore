```
> First please create the manifest file for your both backend and frontend 

Fill the values - example.configmap.yml to configmap.yml
.
├── backend
│   ├── configmap.yml
│   ├── deployment.yml
│   ├── example.configmap.yml
│   ├── ingress.yml
│   └── service.yml
└── frontend
    ├── configmap.yml
    ├── deployment.yml
    ├── ingress.yml
    └── service.yml

kubectl port-forward services/dumpstore-frontend-service 5173:5173
kubectl port-forward services/dumpstore-backend-service 3008:3008


```