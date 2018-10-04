#!/bin/bash

export GKE_PROJECT=julien-test-78574643
export GKE_CLUSTER=hello
export GKE_REGION=us-central1-a
export GKE_ACCOUNT=circleci-service-account
export GKE_BILLING=0189CD-796899-879953

export GKE_SECRET_LOCATION=/Users/paloit/git/cv-presentation/production-auth.json
export GKE_SECRET_NAME=auth-drive-cvfactory

export GKE_VPC_REGION="us-central1"
export GKE_VPC="gke-cluster"
