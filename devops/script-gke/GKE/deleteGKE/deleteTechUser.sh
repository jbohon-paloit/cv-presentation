#!/bin/bash

gcloud config set project $GKE_PROJECT

gcloud iam service-accounts delete $GKE_ACCOUNT

