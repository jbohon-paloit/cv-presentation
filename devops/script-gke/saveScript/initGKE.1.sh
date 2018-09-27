PROJECT=project3843296
CLUSTER=hello
REGION=us-central1-a
ACCOUNT=circleci-service-account
BILLING=0189CD-796899-879953

gcloud projects create "$PROJECT" --enable-cloud-apis --name="$PROJECT"

gcloud beta billing projects link "$PROJECT" --billing-account=$BILLING


gcloud config set project $PROJECT

gcloud config set compute/zone $REGION

gcloud services enable container.googleapis.com

gcloud container clusters create $CLUSTER

gcloud iam service-accounts create $ACCOUNT

gcloud iam service-accounts keys create --iam-account $ACCOUNT@$PROJECT.iam.gserviceaccount.com key-gke.json

gcloud projects add-iam-policy-binding "$PROJECT" --member serviceAccount:$ACCOUNT@$PROJECT.iam.gserviceaccount.com --role roles/editor

gcloud compute instances list
