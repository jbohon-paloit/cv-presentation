TOKENCIRCLECI=`cat confCircleCI.2.sh`
TOKEN=`tr -d "\n\r" < GKE/createGKE/key-gke-formated.json`
REGION="us-central1-a"
PROJECT="cvfactory234"
CLUSTER=hello

curl -X POST --header "Content-Type: application/json" -d '{"name":"GCLOUD_SERVICE_KEY", "value":"'"$TOKEN"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_COMPUTE_ZONE", "value":"'"$REGION"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_PROJECT_ID", "value":"'"$PROJECT"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_CLUSTER_NAME", "value":"'"$CLUSTER"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

#curl https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar/GCLOUD_SERVICE_KEY?circle-token=$TOKENCIRCLECI
