## Argocd 

> Follow this blog - https://shashanksrivastava.medium.com/install-configure-argo-cd-on-kind-kubernetes-cluster-f0fee69e5ac4

> For private github repo - https://argo-cd.readthedocs.io/en/stable/user-guide/private-repositories/

```
rahulxf@Rahuls-MacBook-Air-3 ~ % kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
rahulxf@Rahuls-MacBook-Air-3 ~ % kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

rahulxf@Rahuls-MacBook-Air-3 ~ % kubectl port-forward -n argocd service/argocd-server 8443:443
rahulxf@Rahuls-MacBook-Air-3 ~ % 
```

<img width="1148" alt="Screenshot 2025-06-24 at 12 12 06 AM" src="https://github.com/user-attachments/assets/d24857d5-a72c-4cf2-a34f-308aafc9c449" />


https://github.com/user-attachments/assets/2fa79d1f-e475-4d93-8dd1-6ff74ee0ed9f

<img width="1582" alt="Screenshot 2025-06-24 at 12 13 13 AM" src="https://github.com/user-attachments/assets/378c64a7-200d-4cdf-a109-eabecc784dc8" />
<img width="1582" alt="Screenshot 2025-06-24 at 12 13 16 AM" src="https://github.com/user-attachments/assets/903e09bf-128b-4bfd-a0b3-d3f51821937c" />
<img width="1582" alt="Screenshot 2025-06-24 at 12 13 52 AM" src="https://github.com/user-attachments/assets/cb8c2a7e-c6a1-4984-bd2b-ed486c947e2e" />
<img width="1582" alt="Screenshot 2025-06-24 at 12 13 57 AM" src="https://github.com/user-attachments/assets/d1a01412-77eb-43e9-8e97-ed562db73a16" />
<img width="1582" alt="Screenshot 2025-06-24 at 12 17 19 AM" src="https://github.com/user-attachments/assets/4756f405-351f-4239-9b01-641931fe6f9f" />
