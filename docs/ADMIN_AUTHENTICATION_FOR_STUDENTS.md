# Admin authentication — student implementation

The current frontend includes an admin workspace for the project demonstration. It is not protected by real authentication yet.

For Brief 15, students should implement authentication and authorization in the Spring Boot backend:

1. Provide an admin login endpoint.
2. Verify credentials securely; never store plaintext passwords.
3. Issue and validate an authenticated session or token.
4. Assign roles such as ADMIN and CUSTOMER.
5. Protect all admin API endpoints on the backend.
6. Reject unauthenticated requests and requests from users without the ADMIN role.
7. Connect the frontend admin login to the backend authentication API.
8. Handle expired sessions/tokens and logout.

Important: hiding frontend routes or storing an `isAdmin` flag in localStorage is not security. Backend authorization must protect the data and operations.
