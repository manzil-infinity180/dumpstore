```rs
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl apply -f networkpolicy/dumpstore-example/07-allow-traffic-from-some-pods-in-another-namespace.yml
networkpolicy.networking.k8s.io/web-allow-all-ns-monitoring unchanged
rahulxf@Rahuls-MacBook-Air-3 manifest %  kubectl run test-$RANDOM --rm -i -t --image=alpine -- sh
If you don't see a command prompt, try pressing enter.
/ # wget -qO- --timeout=2 10.244.0.5:3008
wget: download timed out
/ # exit


rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl get ns hello --show-labels                       
NAME    STATUS   AGE   LABELS
hello   Active   14m   kubernetes.io/metadata.name=hello,team=rahulxf
                                                
rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM -n hello --labels="type=monitoring" --rm -i -t --image=alpine -- sh
If you don't see a command prompt, try pressing enter.
/ # wget -qO- --timeout=2 10.244.0.5:3008
Server is Up and Running/ # exit


-> From default namespace 

rahulxf@Rahuls-MacBook-Air-3 manifest % kubectl run test-$RANDOM --labels="type=monitoring" --rm -i -t --image=alpine -- sh 
If you don't see a command prompt, try pressing enter.
/ #  wget -qO- --timeout=2 10.244.0.5:3008
wget: download timed out
/ # exit
```