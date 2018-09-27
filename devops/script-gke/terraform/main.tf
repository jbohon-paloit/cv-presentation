//variable "gke_account" {
//  defaut = ${file("account.json")}
//}

variable "GKE_PROJECT" {}

variable "GKE_REGION" {}

variable "GKE_CLUSTER" {}

// Configure the Google Cloud provider
provider "google" {
  credentials	= "${file("account.json")}"
  project	= "${var.GKE_PROJECT}"
  region	= "${var.GKE_REGION}"
}

//resource "google_container_cluster" "primary" {
//  name				= "${var.project}"
//  zone				= "${var.region}"
//  remove_default_node_pool	= "true"

//  node_pool {
//    name = "defaut-pool"
//  }
//}

resource "google_container_cluster" "primary" {
  name			= "${var.GKE_PROJECT}"
  zone			= "${var.GKE_REGION}"
  initial_node_count	= "3"

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}
