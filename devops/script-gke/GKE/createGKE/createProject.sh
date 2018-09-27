#!/bin/bash

gcloud projects create "$GKE_PROJECT" --enable-cloud-apis --name="$GKE_PROJECT"

gcloud beta billing projects link "$GKE_PROJECT" --billing-account=$GKE_BILLING

gcloud config set project $GKE_PROJECT

gcloud services enable container.googleapis.com
