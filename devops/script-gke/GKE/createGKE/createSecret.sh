kubectl delete secret $GKE_SECRET_NAME 
kubectl create secret generic $GKE_SECRET_NAME --from-file=$GKE_KEY_CVFACTORY
