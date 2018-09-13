BILLING=0189CD-796899-879953
PROJECT=$1

gcloud projects create "$PROJECT" --enable-cloud-apis --name="$PROJECT"

gcloud beta billing projects link "$PROJECT" --billing-account=$BILLING

gcloud config set project $PROJECT

gcloud services enable container.googleapis.com
