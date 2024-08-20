resource "google_compute_disk" "default" {
    name  = "k8s-disk"
    size  = 2
    type  = "pd-standard"
    zone  = "us-west1-a"
}