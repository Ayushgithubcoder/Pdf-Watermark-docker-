locals {
  # Convert map to list of {name, value} for env block iteration
  resolved_env_vars = [for k, v in var.environment_variables : { name = k, value = v }]
}

resource "azurerm_container_app" "this" {
  name                         = var.name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = var.container_app_environment_id
  revision_mode                = var.revision_mode

  dynamic "ingress" {
    for_each = var.ingress != null ? [var.ingress] : []
    content {
      external_enabled = ingress.value.external_enabled
      target_port      = ingress.value.target_port
      transport        = ingress.value.transport

      traffic_weight {
        percentage      = 100
        latest_revision = true
      }
    }
  }

  dynamic "template" {
    for_each = [1]
    content {
      dynamic "container" {
        for_each = length(var.containers) > 0 ? var.containers : [
          {
            name   = "app"
            image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
            cpu    = 0.25
            memory = "0.5Gi"
            env    = []
          }
        ]
        content {
          name   = container.value.name
          image  = container.value.image
          cpu    = container.value.cpu
          memory = container.value.memory

          dynamic "env" {
            for_each = concat(container.value.env, local.resolved_env_vars)
            content {
              name  = env.value.name
              value = env.value.value
            }
          }
        }
      }
    }
  }

  tags = var.tags
}



