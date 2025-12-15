# Supabase MVP - Location-Based Experiences

A backend-first MVP feature built with Supabase and Edge Functions, demonstrating secure data access patterns and authentication flows.

##  Architecture Overview

### Backend Components

#### 1. Database Schema
**Table: `experiences`**
```sql
- id (uuid, primary key)
- title (text)
- category (text)
- latitude (float)
- longitude (float)
- image_path (text)
- created_at (timestamp)
- user_id (uuid, foreign key to auth.users)
```

#### 2. Row Level Security (RLS)
RLS policies ensure:
-  Authenticated users can read all experiences
-  Anonymous users cannot read any data
-  No write access is configured (can be added as needed)

**Policy Implementation:**
```sql
-- Enable RLS
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Read policy for authenticated users only
CREATE POLICY "Authenticated users can read experiences"
ON experiences FOR SELECT
TO authenticated
USING (true);
```

#### 3. Edge Function: `get-experiences`
- Validates user authentication via Supabase JWT
- Fetches experiences from the database
- Returns structured JSON with location pins
- Generates signed URLs for images on-demand

**Endpoint:** `https://[PROJECT_REF].supabase.co/functions/v1/get-experiences`

### Frontend (Expo/React Native)

Minimal implementation showing:
- Authentication flow
- Data fetching from Edge Function
- Basic list/map rendering

---

## Security Considerations

### Why is the Storage Bucket Private?

The Supabase Storage bucket for experience images is configured as **private** for several critical reasons:

1. **Access Control**: Private buckets ensure that only authenticated and authorized users can access images. This prevents unauthorized public access to potentially sensitive location data or user-generated content.

2. **Consistent Security Model**: By keeping the bucket private, we maintain a consistent security posture across the entire application. Just as experience data requires authentication to read, so too should the associated images.

3. **Flexible Authorization**: Private storage allows us to implement fine-grained access control in the future. For example, we could restrict certain experiences and their images to specific user groups, premium members, or content creators.

4. **Audit Trail**: Signed URL generation provides an audit trail of who accessed what content and when, which is valuable for compliance and security monitoring.

### How Signed URLs Work

**Signed URLs** are temporary, cryptographically secure URLs that grant time-limited access to private storage objects:

1. **Generation**: When a user requests experience data, the Edge Function generates signed URLs for each image using Supabase's `createSignedUrl()` method with a configurable expiration time (e.g., 1 hour).

2. **Token-Based Access**: The signed URL contains a token that proves the request was authorized by the server. This token cannot be forged without access to Supabase's secret keys.

3. **Automatic Expiration**: After the expiration time, the URL becomes invalid, preventing long-term unauthorized access even if the URL is shared or leaked.

4. **No Client-Side Keys**: The frontend never needs to know storage credentials. The Edge Function handles all authentication and URL generation server-side, keeping secrets secure.

**Example Flow:**
```
User Request → Edge Function (authenticated) → 
Generate Signed URL (expires in 1hr) → 
Return to Client → Client fetches image using temporary URL
```

---

## Why Edge Functions?

Edge Functions are ideal for this MVP for several reasons:

**1. Authentication Context**: Edge Functions run on Supabase's infrastructure with direct access to the user's JWT token and authentication context. This eliminates the need to expose database credentials to the client and allows for secure server-side validation of user permissions.

**2. Dynamic Data Processing**: The function can generate signed URLs for images on-demand, process query parameters, apply business logic, and transform data before sending it to the client. This keeps the frontend lightweight and the backend flexible.

**3. Scalability**: Edge Functions deploy globally on Deno Deploy, running close to users for low latency. They scale automatically with usage, making them perfect for an MVP that may experience variable traffic patterns.

**4. Security Boundary**: By putting data access logic in an Edge Function rather than using direct client-side queries, we create a clear security boundary. The function can enforce rate limiting, validate inputs, log access, and apply additional authorization rules beyond what RLS provides.

---

## Authentication & RLS Data Protection

The combination of Supabase Authentication and Row Level Security creates a robust security model:

**Authentication Layer**: Users must authenticate via Supabase Auth (email/password, OAuth, magic links, etc.) to receive a valid JWT token. This token is automatically included in requests to Edge Functions and validated server-side.

**RLS Enforcement**: Even if someone bypassed the Edge Function or obtained valid credentials, RLS policies at the database level ensure they can only access data they're authorized to see. This "defense in depth" approach means security isn't dependent on a single layer.

**Token Validation**: The Edge Function uses `supabase.auth.getUser()` to verify the JWT token on every request, ensuring expired or tampered tokens are rejected immediately.

---

## Beyond MVP: Improvements

If this project moved beyond MVP stage, here are key improvements to consider:

### Performance & Caching
- Implement Redis caching for frequently accessed experiences
- Add pagination and cursor-based navigation for large datasets
- Use CDN caching for signed URLs with appropriate cache headers
- Implement lazy loading and image optimization (WebP, thumbnails)

### Features & Functionality
- Add filtering by category, location radius, and date ranges
- Implement search functionality with full-text search
- Add write operations with proper validation and rate limiting
- Support for user favorites, ratings, and comments
- Real-time subscriptions for live updates

### Security Enhancements
- Implement rate limiting per user/IP address
- Add request validation and sanitization middleware
- Set up monitoring and alerting for suspicious activity
- Implement more granular RLS policies (user-specific data, role-based access)
- Add CORS policies and API key authentication for third-party integrations

### Infrastructure
- Add automated tests (unit, integration, e2e)
- Set up CI/CD pipelines with staging environments
- Implement proper error logging and monitoring (Sentry, LogRocket)
- Add database backups and disaster recovery procedures
- Performance monitoring and APM integration

### Developer Experience
- Add comprehensive API documentation (OpenAPI/Swagger)
- Create seed data scripts for local development
- Add TypeScript types and schema validation
- Implement better error handling with user-friendly messages
- Add development tools (linting, formatting, pre-commit hooks)

---

## 📁 Project Structure

```
supabase-edge-mvp/
├── supabase/
│   ├── functions/
│      └── get-experiences/
│          └── index.ts
│   
│      
│       
├── app/
│   └── screens/
│       └── ExperiencesScreen.tsx
├── components/
│   └── ExperiencesList.tsx
├── services/
│   └── supabaseClient.ts
└── README.md
```
