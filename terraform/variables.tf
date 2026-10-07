variable "aws_region" {
  type        = string
  description = "AWS region for infrastructure provisioning"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "production"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance size for Docker Blue-Green host"
  default     = "t3.micro"
}

variable "key_name" {
  type        = string
  description = "Name of existing AWS EC2 Key Pair for SSH access"
  default     = "bluegreen-deployment-key"
}

variable "db_password" {
  type        = string
  description = "Master password for PostgreSQL database"
  sensitive   = true
  default     = "ChangeMeInProduction123!"
}
