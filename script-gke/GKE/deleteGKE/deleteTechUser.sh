PROJECT=$1
ACCOUNT=$2

gcloud config set project $PROJECT

gcloud iam service-accounts delete $ACCOUNT

