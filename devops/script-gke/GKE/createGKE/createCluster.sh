#!/bin/bash

gcloud config set project $GKE_PROJECT

gcloud config set compute/zone $GKE_REGION

gcloud container clusters create $GKE_CLUSTER
