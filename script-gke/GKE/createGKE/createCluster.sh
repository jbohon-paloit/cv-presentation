PROJECT=$1
REGION=$2
CLUSTER=$3

gcloud config set project $PROJECT

gcloud config set compute/zone $REGION

gcloud container clusters create $CLUSTER
