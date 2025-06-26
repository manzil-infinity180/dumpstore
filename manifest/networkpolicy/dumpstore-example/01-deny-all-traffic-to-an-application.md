```rs
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl get pods -owide    
NAME                                             READY   STATUS    RESTARTS        AGE     IP           NODE                  NOMINATED NODE   READINESS GATES
dumpstore-backend-deployment-596596d6bc-xd572    1/1     Running   4 (2m16s ago)   4m30s   10.244.0.5   hello-control-plane   <none>           <none>
dumpstore-frontend-deployment-5c5f64c458-g9cgx   1/1     Running   0               4m20s   10.244.0.6   hello-control-plane   <none>           <none>
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl exec -it dumpstore-frontend-deployment-5c5f64c458-g9cgx -- sh
/frontend # curl 
sh: curl: not found
/frontend # apk add curl
fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz
(1/9) Installing brotli-libs (1.1.0-r2)
(2/9) Installing c-ares (1.34.5-r0)
(3/9) Installing libunistring (1.3-r0)
(4/9) Installing libidn2 (2.3.7-r0)
(5/9) Installing nghttp2-libs (1.65.0-r0)
(6/9) Installing libpsl (0.21.5-r3)
(7/9) Installing zstd-libs (1.5.7-r0)
(8/9) Installing libcurl (8.14.1-r0)
(9/9) Installing curl (8.14.1-r0)
Executing busybox-1.37.0-r18.trigger
OK: 15 MiB in 27 packages
/frontend # curl 10.244.0.5
curl: (7) Failed to connect to 10.244.0.5 port 80 after 0 ms: Could not connect to server
/frontend # curl 10.244.0.5:3008
Server is Up and Running/frontend # exit
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl apply -f networkpolicy/dumpstore-example/01-deny-all-traffic-to-an-application.yml 
networkpolicy.networking.k8s.io/web-deny-all created
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl get deployments.apps dumpstore-backend-deployment --show-labels 
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE     LABELS
dumpstore-backend-deployment   1/1     1            1           5m50s   app=dumpstore-backend-app
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl exec -it dumpstore-frontend-deployment-5c5f64c458-g9cgx -- sh                     
/frontend # curl 10.244.0.5:3008
^C
```