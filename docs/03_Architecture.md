# Architecture Documentation

## Overview

This document describes the architecture, workflows, and system design of the URL Shortener application.

All architecture diagrams are stored inside the diagrams folder.

---

# 1. System Architecture

## Description

This diagram provides a high-level overview of the complete application architecture including frontend, backend, authentication, business logic, ORM layer, and database.

## Diagram

![System Architecture](./diagrams/01_System_Architecture.png)

---

# 2. User Signup Flow

## Description

This diagram illustrates the complete signup workflow from user input to database storage.

The flow includes:

- User Input
- HTTPS Request
- Route Handling
- Controller Execution
- Validation
- bcrypt Salt Generation
- Password Hashing
- Database Storage
- Response Generation

## Diagram

![Signup Flow](./diagrams/02_Signup_Flow.png)

---

# 3. User Login Flow

## Description

This diagram illustrates the complete login workflow.

The flow includes:

- User Login Request
- Route Handling
- User Lookup
- Password Verification
- JWT Generation
- Response Delivery
- Token Storage

## Diagram

![Login Flow](./diagrams/03_Login_Flow.png)

---


# 4. URL Creation Flow

## Description

This diagram explains how a long URL is converted into a short URL.

## Diagram

![URL Creation Flow](./diagrams/04_Create_URL_Flow.png)

---

# 5. URL Redirection Flow

## Description

This diagram explains how a short URL redirects users to the original URL.

## Diagram

![Redirect Flow](./diagrams/05_Redirect_Flow.png)

---

# 6. Analytics Tracking Flow

## Description

This diagram explains how analytics information is recorded whenever a short URL is accessed.

## Diagram

![Analytics Flow](./diagrams/06_Analytics_Flow.png)

---

# 7. Database Entity Relationship Diagram

## Description

This diagram illustrates the relationships between all database entities.

Entities:

- Users
- URLs
- Visits

Relationships:

- One User → Many URLs
- One URL → Many Visits

## Diagram

![Database ERD](./diagrams/07_Database_ERD.png)

---
