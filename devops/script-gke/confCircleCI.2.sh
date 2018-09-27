TOKENCIRCLECI=8533e724d8d3c4382b2a5ece870afd84352c1ce4

GKE_KEY=GKE/createGKE/key-gke.json

echo $GKE_REGION
echo $GKE_PROJECT
echo $GKE_CLUSTER

TOKEN=$(cat $GKE_KEY | sed 's|\\|\\\\|g' | sed 's|"|\\"|g' | tr -d "\n\r")

AUTHAPI=$(cat $GKE_KEY | sed 's|\\|\\\\|g' | sed 's|"|\\"|g' | tr -d "\n\r")

curl -X POST --header "Content-Type: application/json" -d '{"name":"GCLOUD_SERVICE_KEY", "value":"'"$TOKEN"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_COMPUTE_ZONE", "value":"'"$GKE_REGION"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_PROJECT_ID", "value":"'"$GKE_PROJECT"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"GOOGLE_CLUSTER_NAME", "value":"'"$GKE_CLUSTER"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

curl -X POST --header "Content-Type: application/json" -d '{"name":"APPLICATION_AUTH", "value":"'"$AUTHAPI"'"}' https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar?circle-token=$TOKENCIRCLECI

#curl https://circleci.com/api/v1.1/project/github/jbohon-paloit/cv-presentation/envvar/GCLOUD_SERVICE_KEY?circle-token=$TOKENCIRCLECI
