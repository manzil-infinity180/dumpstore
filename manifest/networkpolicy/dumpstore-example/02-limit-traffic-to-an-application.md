```rs
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl exec -it dumpstore-frontend-deployment-5c5f64c458-g9cgx -- sh                      
/frontend # curl 10.244.0.5:3008
Server is Up and Running/frontend # exit
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --rm -i -t --image=alpine -- sh
If you don't see a command prompt, try pressing enter.
/ # wget -qO- --timeout=2 10.244.0.5:3008
wget: download timed out
/ # exit
Session ended, resume using 'kubectl attach test-22233 -c test-22233 -i -t' command when the pod is running
pod "test-22233" deleted
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --rm -i -t --image=alpine --labels="app: dumpstore-frontend-app" -- sh
error: unexpected label spec: app: dumpstore-frontend-app
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --rm -i -t --image=alpine --labels="app=dumpstore-frontend-app" -- sh
If you don't see a command prompt, try pressing enter.
/ # wget -qO- --timeout=2 10.244.0.5:3008
Server is Up and Running/ # exit
```