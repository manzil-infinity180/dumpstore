```

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: frontend


rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl get pods -owide                                              
NAME                                  READY   STATUS    RESTARTS        AGE   IP           NODE                 NOMINATED NODE   READINESS GATES
backend-app-5b9c997fcf-rnh7j          1/1     Running   1 (4m33s ago)   15h   10.42.0.27   k3d-wolfi-server-0   <none>           <none>
busybox                               1/1     Running   1 (4m33s ago)   14h   10.42.0.26   k3d-wolfi-server-0   <none>           <none>
dumpstore-backend-894b8666-gkwd9      1/1     Running   1 (4m33s ago)   23h   10.42.0.28   k3d-wolfi-server-0   <none>           <none>
dumpstore-frontend-59c6cb84cf-9xshj   1/1     Running   1 (4m33s ago)   23h   10.42.0.31   k3d-wolfi-server-0   <none>           <none>
frontend-app-65d978c499-4p4pd         1/1     Running   1 (4m33s ago)   15h   10.42.0.30   k3d-wolfi-server-0   <none>           <none>

rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl exec -it backend-app-5b9c997fcf-rnh7j -- curl -sS 10.42.0.30 
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>


rahulxf@Rahuls-MacBook-Air-3 Dumpstore % kubectl exec -it frontend-app-65d978c499-4p4pd -- curl -sS 10.42.0.27
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

```