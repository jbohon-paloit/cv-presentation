PROJECT=$1


gcloud config set project $PROJECT

gcloud projects delete "$PROJECT"

gcloud config unset project $PROJECT
