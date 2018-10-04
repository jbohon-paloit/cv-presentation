docker build -t eu.gcr.io/julien-test-78574643/cvfactory ..
docker push eu.gcr.io/julien-test-78574643/cvfactory
kubectl delete deployment cvfactory
#kubectl delete service cvfactory
kubectl create -f kube-cvfactory-local.yaml
#kubectl create -f kube-cvfactory-service.yaml
