variable "name" {
  description = "Name of the container app"
  type        = string
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "container_app_environment_id" {
  description = "Container App Environment ID"
  type        = string
}

variable "revision_mode" {
  description = "Revision mode (Single or Multiple)"
  type        = string
  default     = "Single"

  validation {
    condition     = contains(["Single", "Multiple"], var.revision_mode)
    error_message = "Revision mode must be Single or Multiple."
  }
}

variable "ingress" {
  description = "Ingress configuration (optional)"
  type = object({
    external_enabled = bool
    target_port      = number
    transport        = string
  })
  default = null
}

variable "containers" {
  description = "Container configurations (optional)"
  type = list(object({
    name   = string
    image  = string
    cpu    = number
    memory = string
    env = list(object({
      name  = string
      value = string
    }))
  }))
  default = []
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}

variable "environment_variables" {
  description = "Environment variables to inject into all containers. Values are resolved Terraform expressions."
  type        = map(string)
  default     = {}
}

