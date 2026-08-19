terraform {
  required_version = ">= 1.6.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Azure Blob Storage backend for OpenTofu state
  # Uncomment & configure values when using remote backend:
  # backend "azurerm" {
  #   resource_group_name  = "rg-tofu-state"
  #   storage_account_name = "tofestatestorage"
  #   container_name       = "tfstate"
  #   key                  = "pdf-watermarker.tfstate"
  # }
}

provider "azurerm" {
  features {}
}
