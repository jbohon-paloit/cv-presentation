PROJECT=project3843296
CLUSTER=hello
REGION=us-central1-a
ACCOUNT=circleci-service-account

gcloud projects delete "$PROJECT"

#gcloud config unset project $PROJECT

#gcloud beta billing projects unlink "$PROJECT"

#gcloud services disable container.googleapis.com

#gcloud container clusters delete $CLUSTER

#gcloud iam service-accounts delete $ACCOUNT

#gcloud iam service-accounts keys delete --iam-account $ACCOUNT@$PROJECT.iam.gserviceaccount.com key-gke.json
