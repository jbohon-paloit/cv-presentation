PROJECT=cvfactory234
CLUSTER=hello
REGION=us-central1-a
ACCOUNT=circleci-service-account

./createProject.sh $PROJECT
./createCluster.sh $PROJECT $REGION $CLUSTER
./createTechUser.sh $PROJECT $ACCOUNT
