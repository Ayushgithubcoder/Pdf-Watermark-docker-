output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "The login server URL for the Azure Container Registry"
}

output "acr_admin_username" {
  value       = azurerm_container_registry.acr.admin_username
  description = "The admin username for ACR"
}

output "webapp_url" {
  value       = "https://${azurerm_linux_web_app.webapp.default_hostname}"
  description = "Public URL of the deployed PDF Watermarker web app"
}
