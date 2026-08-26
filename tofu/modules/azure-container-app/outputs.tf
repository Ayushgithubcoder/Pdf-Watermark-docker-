output "id" {
  description = "The ID of the Container App"
  value       = azurerm_container_app.this.id
}

output "name" {
  description = "The name of the Container App"
  value       = azurerm_container_app.this.name
}

output "latest_revision_fqdn" {
  description = "The FQDN of the latest revision"
  value       = azurerm_container_app.this.latest_revision_fqdn
}



