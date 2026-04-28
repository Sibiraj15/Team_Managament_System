# Team Management System - Project Blueprint

## Goal

Build a MERN application that manages users, teams, roles, and permissions using role-based access control (RBAC).

The most important rule is:

- a user can have different roles in different teams
- permissions are resolved from the user's role within a selected team

Example:

- User A can be `Admin` in `Team Alpha`
- User A can be `Viewer` in `Team Beta`

If a user has no role in a team, they have no permissions in that team.

## Core Features

### Users

- Create user
- List users
- Enforce unique email

### Teams

- Create team
- List teams

### Membership

- Add user to a team
- Remove user from a team

### Roles

- Create reusable roles
- Assign one or more permissions to roles
- List roles

### Role Assignment

- Assign a role to a user within a specific team
- Update role assignment

### Permission Resolution

- Fetch permissions for a selected user in a selected team

## Recommended Data Model

### `users`

```js
{
  _id,
  name: String,
  email: String, // unique
  createdAt,
  updatedAt
}
```

### `teams`

```js
{
  _id,
  name: String,
  description: String,
  createdAt,
  updatedAt
}
```

### `roles`

```js
{
  _id,
  name: String, // Admin, Manager, Viewer
  description: String,
  permissions: [String], // ["CREATE_TASK", "EDIT_TASK", "VIEW_ONLY"]
  createdAt,
  updatedAt
}
```

### `team_memberships`

Use this collection to model the user-team-role relationship.

```js
{
  _id,
  userId: ObjectId,   // ref users
  teamId: ObjectId,   // ref teams
  roleId: ObjectId,   // ref roles
  createdAt,
  updatedAt
}
```

## Why This Model

This avoids two bad designs explicitly warned against in the assignment:

- storing one global role on the user
- hardcoding permissions in app logic

The relationship is not:

- user -> role

It is:

- user -> team -> role

That mapping is the heart of the system.

## Optional Extension for Multiple Roles Per Team

If you want the bonus requirement later, update `team_memberships` to support:

```js
{
  userId,
  teamId,
  roleIds: [ObjectId]
}
```

For the first version, one role per user per team is simpler and fully matches the core assignment.

## Permission Strategy

Keep permissions as constants shared by backend and frontend.

Recommended values:

```js
[
  "CREATE_TASK",
  "EDIT_TASK",
  "DELETE_TASK",
  "VIEW_ONLY",
  "MANAGE_MEMBERS",
  "ASSIGN_ROLES"
]
```

For the assignment, even if tasks are not fully implemented, these permission names make the RBAC behavior easy to demonstrate in the UI.

## Backend API Design

Base path:

```txt
/api
```

### Users

- `POST /api/users`
- `GET /api/users`

Example payload:

```json
{
  "name": "Akshaya",
  "email": "akshaya@example.com"
}
```

### Teams

- `POST /api/teams`
- `GET /api/teams`

Example payload:

```json
{
  "name": "Team Alpha",
  "description": "Core product team"
}
```

### Roles

- `POST /api/roles`
- `GET /api/roles`
- `PATCH /api/roles/:roleId/permissions`

Example role payload:

```json
{
  "name": "Admin",
  "description": "Full team access",
  "permissions": ["CREATE_TASK", "EDIT_TASK", "DELETE_TASK", "ASSIGN_ROLES"]
}
```

### Membership / Role Assignment

- `POST /api/memberships`
- `PATCH /api/memberships/:membershipId`
- `DELETE /api/memberships/:membershipId`
- `GET /api/memberships`

Example create payload:

```json
{
  "userId": "USER_ID",
  "teamId": "TEAM_ID",
  "roleId": "ROLE_ID"
}
```

Suggested query support:

- `GET /api/memberships?teamId=...`
- `GET /api/memberships?userId=...`

### Permission Resolution

- `GET /api/permissions?userId=USER_ID&teamId=TEAM_ID`

Example response:

```json
{
  "userId": "USER_ID",
  "teamId": "TEAM_ID",
  "role": {
    "id": "ROLE_ID",
    "name": "Admin"
  },
  "permissions": ["CREATE_TASK", "EDIT_TASK", "DELETE_TASK"]
}
```

If no role is assigned:

```json
{
  "userId": "USER_ID",
  "teamId": "TEAM_ID",
  "role": null,
  "permissions": []
}
```

## Backend Folder Structure

```txt
backend/
  src/
    config/
      db.js
    constants/
      permissions.js
    controllers/
      userController.js
      teamController.js
      roleController.js
      membershipController.js
      permissionController.js
    middleware/
      errorHandler.js
      notFound.js
    models/
      User.js
      Team.js
      Role.js
      TeamMembership.js
    routes/
      userRoutes.js
      teamRoutes.js
      roleRoutes.js
      membershipRoutes.js
      permissionRoutes.js
    services/
      permissionService.js
    utils/
      asyncHandler.js
    app.js
    server.js
  package.json
  .env.example
```

## Frontend Folder Structure

```txt
frontend/
  src/
    api/
      client.js
    components/
      layout/
      users/
      teams/
      roles/
      permissions/
      memberships/
    pages/
      Dashboard.jsx
    hooks/
    utils/
    App.jsx
    main.jsx
  package.json
```

## Frontend Screens

For a good first version, build one main dashboard with these sections:

1. User management
2. Team management
3. Role management
4. Team membership and role assignment
5. Permission viewer

## Recommended Dashboard Workflow

The UI should let the user:

1. create users
2. create teams
3. create roles with permissions
4. assign a user to a team with a role
5. select a user and a team
6. immediately see resolved permissions

## Frontend State

Useful state shape:

```js
{
  users: [],
  teams: [],
  roles: [],
  memberships: [],
  selectedUserId: "",
  selectedTeamId: "",
  resolvedPermissions: []
}
```

## Validation Rules

- user email must be unique
- role name should be unique
- team name should ideally be unique
- one membership per user-team pair in v1
- all referenced ids must exist

## Suggested MongoDB Indexes

- `users.email` unique
- `roles.name` unique
- `teams.name` unique
- `team_memberships` compound unique index on `userId + teamId`

## Service Logic

The permission resolution logic should live in a service, not directly inside route handlers.

Pseudo flow:

1. find membership by `userId` and `teamId`
2. if none exists, return empty permissions
3. load referenced role
4. return role permissions

## Nice-to-Have Extras

- JWT auth
- pagination for users and teams
- filter/search for users by name or email
- permission guard middleware
- seed script for sample data

## Recommended Build Order

1. backend models
2. backend CRUD APIs
3. permission resolution service
4. frontend dashboard
5. dynamic permission display
6. polish, validation, and optional auth

## Deliverable Goal

By the end, the app should clearly prove this behavior:

- the same user gets different permissions in different teams based on assigned role

That is the key scenario the reviewer will likely test first.
