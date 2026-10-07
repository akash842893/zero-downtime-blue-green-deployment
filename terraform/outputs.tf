output "server_public_ip" {
  description = "Public Elastic IP address of the deployment server"
  value       = aws_eip.app_eip.public_ip
}

output "ssh_connection_command" {
  description = "Command to SSH into the deployment server"
  value       = "ssh -i path/to/${var.key_name}.pem ec2-user@${aws_eip.app_eip.public_ip}"
}

output "application_url" {
  description = "Public HTTP URL of the Zero-Downtime Application"
  value       = "http://${aws_eip.app_eip.public_ip}"
}
