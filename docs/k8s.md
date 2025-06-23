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

```
rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl get deployments.apps 
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
dumpstore-backend    1/1     1            1           3m47s
dumpstore-frontend   1/1     1            1           3m47s
rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl get pods
NAME                                  READY   STATUS    RESTARTS   AGE
dumpstore-backend-894b8666-wpv77      1/1     Running   0          3m51s
dumpstore-frontend-59c6cb84cf-dfz6s   1/1     Running   0          3m51s
rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl get svc
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
dumpstore-backend    ClusterIP   10.43.26.226   <none>        3008/TCP   3m55s
dumpstore-frontend   ClusterIP   10.43.211.47   <none>        5173/TCP   3m55s
rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl get sa
NAME                   SECRETS   AGE
default                0         9m19s
dumpstore-backend-sa   0         4m7s
rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl port-forward svc/dumpstore-backend 3008:3008
Forwarding from 127.0.0.1:3008 -> 3008
Forwarding from [::1]:3008 -> 3008
```
