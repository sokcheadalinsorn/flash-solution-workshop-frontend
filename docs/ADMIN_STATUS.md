# Admin area status

## Included in this frontend
- Admin dashboard layout and navigation
- Product list, search, status filter, add/edit form and demo delete
- User management list, search, demo role/status changes and demo removal
- Admin login screen design is not connected to a real authentication service

## Not yet secure / not yet implemented
The frontend currently does not authenticate administrators or enforce permissions. Demo product and user data are stored in browser state/localStorage.

## Student implementation task (Spring Boot)
Students should implement:
1. Authentication endpoint and secure password verification
2. Token or session handling
3. ADMIN and CUSTOMER roles
4. Backend authorization for all admin-only endpoints
5. Frontend login/logout integration
6. Route handling for unauthenticated and unauthorized users

Do not treat a hidden frontend route or a localStorage role flag as security. The backend must enforce access control.
