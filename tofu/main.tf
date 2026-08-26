# Terraform configuration generated from Resource Plan
# Environment: dev
# Generated from deterministic resource plan (Phase 2)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "demoTest-dev-rg"
    storage_account_name = "demotestdevstoragefbf039"
    container_name       = "tfstate-system"
    key                  = "apps/Test-06-dev/dev.tfstate"
    subscription_id      = "d6c69b8a-1b49-482e-80c0-95ccb98fd3c6"
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Merge var.environment into tags so every resource carries the environment label.
# This ensures var.environment is consumed and not dead code.
locals {
  common_tags = merge(var.tags, { environment = var.environment })
}

# ========================================
# Phase: 1 Foundation
# ========================================

# Module: main_rg (azurerm_resource_group)
module "main_rg" {
  source = "./modules/azure-resource-group"

  location = var.location
  name     = "Test-06-dev-rg"
  tags     = local.common_tags
}

# Shared Data Lookup: log_analytics (azurerm_log_analytics_workspace)
data "azurerm_log_analytics_workspace" "shared" {
  name                = "test-01-dev-infrastructure"
  resource_group_name = "platform-shared-rg"
}

# ========================================
# Phase: 2 Shared Infrastructure
# ========================================

# Resource: app_pdf_watermarker_service (azurerm_container_app_environment)
resource "azurerm_container_app_environment" "app_pdf_watermarker_service" {
  name                       = "myorg-test-06-dev-shared-dev-centralus-env"
  location                   = var.location
  resource_group_name        = module.main_rg.name
  log_analytics_workspace_id = data.azurerm_log_analytics_workspace.shared.id
  tags                       = local.common_tags
}

# Shared Data Lookup: tfstate_storage (azurerm_storage_account)
data "azurerm_storage_account" "shared" {
  name                = "demotestdevstoragefbf039"
  resource_group_name = "demoTest-dev-rg"
}

# ========================================
# Phase: 4 Compute
# ========================================

# Module: pdf_watermarker_service_app (azurerm_container_app)
module "pdf_watermarker_service_app" {
  source = "./modules/azure-container-app"

  container_app_environment_id = azurerm_container_app_environment.app_pdf_watermarker_service.id
  containers                   = [{ "name" : "pdf-watermarker-service", "image" : "${var.pdf_watermarker_service_image}", "cpu" : 0.25, "memory" : "0.5Gi", "env" : [] }]
  ingress = {
    external_enabled = true
    target_port      = 8080
    transport        = "http"
  }
  location            = var.location
  name                = "test-06-dev-pdf-watermarker-serv"
  resource_group_name = module.main_rg.name
  revision_mode       = "Single"
  tags                = local.common_tags
}
