Cursor Labs API

A REST API for storing, publishing, discovering, and tracking interactive cursor designs used by the Cursor Labs Chrome extension.

Cursor Labs API is the backend service for a Chrome extension that allows users to create and share custom cursor experiences. The service persists cursor appearance, trail behavior, click effects, hover states, selection states, engagement counts, and complete serialized design configurations.

The project uses Express for HTTP routing and SQLite for lightweight local persistence.

Status: Functional prototype. The current version supports the complete design-sharing workflow but requires authentication, stronger validation, pagination, and automated tests before public deployment.

Project Highlights

Built a REST API with Node.js and Express

Used SQLite for persistent cursor-design storage

Designed a schema for interactive cursor appearance and behavior

Added sorting by popularity or creation date

Implemented individual design retrieval

Added publishing, liking, downloading, and deletion endpoints

Stored complete cursor-engine configurations as serialized JSON

Seeded starter designs for immediate local testing

Used parameterized SQL statements for user-provided values

Added CORS support for a separately hosted Chrome extension

Added development and production npm scripts

System Role

Cursor Labs is split into two repositories:

Cursor Labs Chrome Extension
          |
          | HTTP requests
          v
Cursor Labs API
          |
          v
SQLite Database

The extension is responsible for the user interface and cursor rendering. This repository is responsible for persistence, discovery, engagement counters, and design retrieval.

Core Features

Design Discovery

Clients can request all saved designs and sort them by:

Most liked

Most recently created

Individual Design Retrieval

Clients can retrieve one cursor design by its numeric ID.

Design Publishing

New designs can include:

Name

Author

Default cursor color

Default cursor size

Default cursor shape

Trail enabled state

Trail length

Trail effect

Click effect

Hover color

Hover size

Hover shape

Selection color

Selection size

Selection shape

Full serialized engine configuration

Engagement Tracking

The API tracks:

Likes

Downloads

Each counter is stored directly on the design record.

Starter Data

When the database is empty, the application seeds several example designs:

Cyber Neon

Blood Moon

Ghost

Matrix

This allows the extension interface to display usable content immediately after setup.

Technology Stack

Node.js

Express 4

SQLite3

CORS

Nodemon

API Endpoints

Method

Endpoint

Purpose

GET

/designs

Return all designs

GET

/designs?sort=recent

Return newest designs first

GET

/designs/:id

Return one design

POST

/designs

Publish a new design

POST

/designs/:id/like

Increment a design's like count

POST

/designs/:id/download

Increment a design's download count

DELETE

/designs/:id

Permanently delete a design

Example Design Request

{
  "name": "Electric Orbit",
  "author": "Aiden",
  "color": "#00f0ff",
  "size": 14,
  "shape": "circle",
  "trail": true,
  "trailCount": 30,
  "trailEffect": "sparkle",
  "clickEffect": "ripple",
  "hoverColor": "#ff3cac",
  "hoverSize": 24,
  "hoverShape": "ring",
  "selectColor": "#ffe600",
  "selectSize": 20,
  "selectShape": "crosshair",
  "designData": {
    "engineVersion": 1,
    "customSettings": {}
  }
}

Example Response

{
  "id": 5,
  "name": "Electric Orbit",
  "author": "Aiden",
  "likes": 0,
  "downloads": 0,
  "createdAt": "2026-07-21 18:00:00",
  "color": "#00f0ff",
  "size": 14,
  "shape": "circle",
  "trail": 1,
  "trailCount": 30,
  "trailEffect": "sparkle",
  "clickEffect": "ripple",
  "hoverColor": "#ff3cac",
  "hoverSize": 24,
  "hoverShape": "ring",
  "selectColor": "#ffe600",
  "selectSize": 20,
  "selectShape": "crosshair",
  "designData": "{\"engineVersion\":1,\"customSettings\":{}}"
}

Database Schema

The designs table stores:

Field

Purpose

id

Primary design identifier

name

Public design name

author

Creator display name

likes

Popularity counter

downloads

Download counter

createdAt

Creation timestamp

color

Default cursor color

size

Default cursor size

shape

Default cursor shape

trail

Whether the trail is enabled

trailCount

Number of trail elements

trailEffect

Trail rendering behavior

clickEffect

Click animation

hoverColor

Hover-state color

hoverSize

Hover-state size

hoverShape

Hover-state shape

selectColor

Selection-state color

selectSize

Selection-state size

selectShape

Selection-state shape

designData

Complete serialized engine configuration

The individual columns make common fields easy to query, while designData allows the extension to preserve richer engine settings without requiring a schema change for every experimental option.

Project Structure

cursor-labs-api/
├── database.js     # SQLite connection, schema creation, and seed data
├── server.js       # Express routes and API startup
├── package.json    # Dependencies and npm scripts
├── .gitignore      # Excludes local dependencies and database data
└── designs.db      # Generated local SQLite database

Local Setup

Requirements

Node.js

npm

Install Dependencies

npm install

Start the API

npm start

The server runs at:

http://localhost:3001

Development Mode

npm run dev

Nodemon restarts the server when source files change.

Engineering Decisions

Separate Client and API Repositories

The Chrome extension and API are maintained as separate projects.

This keeps the browser extension focused on rendering and interaction while the backend owns persistence and community data.

Structured Fields and Serialized Configuration

Frequently used properties are stored in dedicated database columns. The full engine state can also be stored in designData as JSON.

This hybrid approach supports simple sorting and display while leaving room for more advanced cursor-engine features.

Parameterized Queries

Dynamic values are passed through SQLite placeholders rather than being concatenated into SQL statements.

The design-list sorting field is selected from two hard-coded server values, preventing arbitrary SQL from being accepted through the query parameter.

Lightweight Persistence

SQLite keeps local development simple and requires no separate database server. It is appropriate for a prototype and can later be replaced with PostgreSQL or another production database.

Current Limitations

No user authentication

No authorization for deletion

Any client can increment likes and downloads repeatedly

CORS is open to every origin

Request validation is minimal

No pagination or result limits

No search endpoint

No design update endpoint

No ownership model

designData is returned as a JSON string

Database schema changes are handled through a silent ALTER TABLE

Database initialization errors are not fully handled

No rate limiting

No automated tests

No API documentation generator

SQLite may become a bottleneck under heavier concurrent traffic

Production Readiness Roadmap

Add user accounts and authenticated sessions

Associate designs with user IDs

Restrict editing and deletion to design owners

Add request-schema validation

Add pagination, search, and filtering

Parse designData before returning responses

Add rate limiting

Restrict CORS to approved extension origins

Add unique-like and download-event tracking

Add an update endpoint

Add soft deletion and moderation state

Replace ad hoc schema updates with migrations

Add centralized error handling

Add API unit and integration tests

Add OpenAPI documentation

Move to PostgreSQL when deployment scale requires it

Skills Demonstrated

REST API design

Express backend development

SQLite integration

Relational schema design

Prepared SQL statements

JSON serialization

Database seeding

HTTP status codes

CORS configuration

Client-server architecture

Engagement tracking

Error handling

Production-readiness analysis

Technical documentation

Author

Aiden Figueroa
