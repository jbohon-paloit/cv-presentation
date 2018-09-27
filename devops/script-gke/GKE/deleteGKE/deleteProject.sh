#!/bin/bash

gcloud config set project $GKE_PROJECT

gcloud projects delete "$GKE_PROJECT"

gcloud beta billing projects unlink "$GKE_PROJECT"

gcloud config unset project $GKE_PROJECT
