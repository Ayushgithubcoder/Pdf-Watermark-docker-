# Variables for Terraform configuration
# Environment: dev

# Common variables
variable "environment" {
  description = "Environment name (dev/staging/prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
}


variable "subscription_id" {
  description = "Azure subscription ID (not a secret)"
  type        = string
}
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {
    environment = "dev"
    managed_by  = "cloud-dhan"
  }
}

# Resource-specific variables
variable "pdf_watermarker_service_image" {
  description = "Container image for pdf-watermarker-service"
  type        = string
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}
