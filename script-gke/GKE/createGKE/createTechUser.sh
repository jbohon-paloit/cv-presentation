PROJECT=$1
ACCOUNT=$2

gcloud config set project $PROJECT

gcloud iam service-accounts create $ACCOUNT

gcloud iam service-accounts keys create --iam-account $ACCOUNT@$PROJECT.iam.gserviceaccount.com key-gke.json

gcloud projects add-iam-policy-binding "$PROJECT" --member serviceAccount:$ACCOUNT@$PROJECT.iam.gserviceaccount.com --role roles/editor
