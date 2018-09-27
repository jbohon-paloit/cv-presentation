#!/bin/bash

. ../var.sh

#use technical account
#gcloud auth activate-service-account [ACCOUNT] --key-file=[JSON FILE]

./createProject.sh
./createCluster.sh
./createTechUser.sh
./createSecret.sh
