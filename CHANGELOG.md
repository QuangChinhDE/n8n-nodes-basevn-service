# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-12

### Added
- Initial release of n8n-nodes-basevn-service
- Service resource with 4 operations:
  - Get All Services
  - Get All Compounds
  - Get All Groups
  - Get Service Blocks
- Ticket resource with 11 operations:
  - Create Ticket
  - Update Ticket
  - Update Ticket Custom Fields
  - Assign Ticket
  - Execute Ticket
  - Move Ticket Back
  - Move Ticket to Block
  - Get All Tickets
  - Get Ticket Details with Block
  - Get Ticket Activity Log
  - Get Possible Transitions
- Credentials for BaseVN Service API (domain + access_token_v2)
- Response selector for all GET operations
- Custom fields support for ticket operations
- Comprehensive error handling
