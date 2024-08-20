variable "gcp_credentials" {
    type = string
    description = "Location of service account for GCP"
}

variable "gcp_project_id" {
    type = string
    description = "GCP Project Id"
}

variable "gcp_region" {
    type = string
    description = "GCP Region"
}

variable "gke_cluster_name" {
    type = string
    description = "GKE Cluster Name"
}

variable "gke_regional" {
    type = string
    description = "GKE Regional"
}

variable "gke_zones" {
    type = list(string)
    description = "List of Zones for GKE Cluster"
}

variable "gke_network" {
    type = string
    description = "VPC Network Name"
}

variable "gke_subnetwork" {
    type = string
    description = "VPC SubNetwork Name"
}

variable "gke_default_nodepool_name" {
    type = string
    description = "GKE Default Node Pool Name"
}

variable "gke_service_account_name" {
    type = string
    description = "GKE Service Acoount Name"
}
