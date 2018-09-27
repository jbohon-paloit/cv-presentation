
#!/bin/bash

gcloud config set project $GKE_PROJECT

gcloud iam service-accounts create $GKE_ACCOUNT

gcloud iam service-accounts keys create --iam-account $GKE_ACCOUNT@$GKE_PROJECT.iam.gserviceaccount.com key-gke.json

gcloud projects add-iam-policy-binding "$GKE_PROJECT" --member serviceAccount:$GKE_ACCOUNT@$GKE_PROJECT.iam.gserviceaccount.com --role roles/editor

gcloud auth activate-service-account $GKE_ACCOUNT@$GKE_PROJECT.iam.gserviceaccount.com --key-file=key-gke.json
