PROJECT=project96573633
CLUSTER=hello
REGION=us-central1-a
ACCOUNT=circleci-service-account

./deleteCluster.sh $PROJECT $REGION $CLUSTER
./deleteTechUser.sh $PROJECT $ACCOUNT
./deleteProject.sh $PROJECT
