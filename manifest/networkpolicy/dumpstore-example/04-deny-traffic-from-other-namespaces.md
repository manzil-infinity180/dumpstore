```rs
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl delete -f networkpolicy/dumpstore-example/02-limit-traffic-to-an-application.yml
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --rm -i -t --image=alpine --labels="app=dumpstore-frontend-app" -- sh 
If you don't see a command prompt, try pressing enter.
/ # wget -qO- --timeout=2 10.244.0.5:3008
Server is Up and Running/ # exit
Session ended, resume using 'kubectl attach test-13943 -c test-13943 -i -t' command when the pod is running
pod "test-13943" deleted
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl create ns hello
namespace/hello created
rahulxf@Rahuls-MacBook-Air-3 manifest % kubens hello 
Context "kind-hello" modified.
Active namespace is "hello".
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --rm -i -t --image=alpine --labels="app=dumpstore-frontend-app" -- sh 
If you don't see a command prompt, try pressing enter.
/ #  wget -qO- --timeout=2 10.244.0.5:3008
wget: download timed out
/ # exit
```