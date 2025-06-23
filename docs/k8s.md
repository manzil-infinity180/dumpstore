```rs
$ cd dumpstore
$ helm create demochart

> remove all the deployment/serviceaccount from the template folder 

helm/dumpstore
├── Chart.yaml
├── charts
├── templates
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── service-backend.yaml
│   └── service-frontend.yaml
└── values.yaml

Update the values.yaml > so they can support different top-level key (like backend and frontend)

> After this please update your 
── templates
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── service-backend.yaml
│   └── service-frontend.yaml

```
> After doing this all stuff / updating the templates 

> | Note you need to create the configmap (which takes all the `cred` for backend to run, without this you cannot run the backend application ) - look [example.configmap.yml](https://github.com/manzil-infinity180/dumpstore/blob/main/manifest/backend/example.configmap.yml)

```rs
if you are at top level 

rahulxf@Rahuls-MacBook-Air-3 Dumpstore % helm upgrade --install dumpstore ./helm/dumpstore -f ./helm/dumpstore/values.yaml
```



```rs
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

rahulxf@Rahuls-MacBook-Air-3 Dumpstore %  kubectl port-forward svc/dumpstore-frontend 5173:5173
Forwarding from 127.0.0.1:5173 -> 5173
Forwarding from [::1]:5173 -> 5173
Handling connection for 5173
```
