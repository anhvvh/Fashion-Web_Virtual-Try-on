# Common Errors & Solutions

## Database & Migrations

### Migration Order Dependency
**Error:** RLS policies fail because `role` column doesn't exist in `profiles` table.

**Solution:** Always run migrations in order:
1. `010_add_role_to_profiles.sql` (add role column)
2. `011_seed_admin_user.sql` (seed admin user)
3. `009_enable_rls_catalog.sql` (RLS policies that check role)

**Prevention:** Check dependencies before creating RLS policies that reference columns.

### Seed Data Password Hash
**Error:** Using placeholder password hash in seed data.

**Solution:** Generate real bcrypt hash before seeding:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
```

**Prevention:** Always generate real hashes for seed data, document the original password.

## Code Updates

### Repository Field Selection
**Error:** Forgot to include new columns (like `role`) in repository select queries.

**Solution:** Update all repository methods to include new columns when schema changes.

**Prevention:** When adding new columns to tables, search for all `.select()` calls and update them.

### JWT Token Payload
**Error:** JWT token doesn't include role, causing admin middleware to fail.

**Solution:** Include role in token payload when signing JWT in auth service.

**Prevention:** When adding new user attributes that affect authorization, update JWT payload.

