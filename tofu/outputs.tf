# Outputs for Terraform configuration
# Environment: dev

output "pdf-watermarker-service_id" {
  description = "Resource ID of pdf-watermarker-service"
  value       = module.pdf_watermarker_service_app.id
}

output "pdf-watermarker-service_url" {
  description = "URL of pdf-watermarker-service"
  value       = module.pdf_watermarker_service_app.latest_revision_fqdn
}

output "resource_group_id" {
  description = "Resource group ID"
  value       = module.main_rg.id
}

output "resource_group_name" {
  description = "Resource group name"
  value       = module.main_rg.name
}
