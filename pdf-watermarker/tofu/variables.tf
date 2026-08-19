variable "resource_group_name" {
  type        = string
  default     = "rg-pdf-watermarker"
  description = "Name of the Azure Resource Group"
}

variable "location" {
  type        = string
  default     = "East US"
  description = "Azure region for resource deployment"
}

variable "app_name" {
  type        = string
  default     = "pdf-watermarker"
  description = "Base name for application resources"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Deployment environment"
}
