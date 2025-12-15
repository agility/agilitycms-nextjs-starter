# Quick Start for AI-Assisted Development

This guide helps AI coding assistants (Claude Code, Cursor, GitHub Copilot, ChatGPT) understand this project quickly.

## Project Overview

**Stack:** Next.js 15 + React 18 + TypeScript + Agility CMS + Tailwind CSS

**Key Directories:**
```
lib/cms/              → Generic CMS utilities
lib/cms-content/      → Domain-specific queries
lib/types/            → TypeScript interfaces
components/agility-components/  → CMS modules (registered)
components/agility-pages/       → Page templates
components/common/    → Shared UI components
```

## Common Tasks for AI

### 1. Create a New CMS Component

**User Request:** "Create a TeamGrid component that displays team members"

**AI Steps:**

1. **Create interface** (`lib/types/ITeamMember.ts`):
```typescript
export interface ITeamMember {
  contentID: number;
  name: string;
  title: string;
  bio?: string;
  photo?: {
    url: string;
    label: string;
  };
}
```

2. **Create component** (`components/agility-components/TeamGrid.tsx`):
```typescript
import { UnloadedModuleProps } from "@agility/nextjs";
import { getContentList } from "@/lib/cms/getContentList";
import { ITeamMember } from "@/lib/types/ITeamMember";
import { AgilityPic } from "@agility/nextjs";

interface ITeamGridModule {
  heading: string;
  teamContainer: string;  // Reference to team members container
}

export default async function TeamGrid({
  module,
  languageCode,
}: UnloadedModuleProps) {
  const { fields } = module as { fields: ITeamGridModule };

  // Fetch team members
  const members = await getContentList<ITeamMember>({
    referenceName: fields.teamContainer || "teammembers",
    languageCode,
  });

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 dark:text-white">
          {fields.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.contentID}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              {member.photo && (
                <AgilityPic
                  image={member.photo}
                  fallbackWidth={300}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold dark:text-white">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{member.title}</p>
              {member.bio && (
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

3. **Register** (`components/agility-components/index.ts`):
```typescript
import TeamGrid from "./TeamGrid";

const allModules = [
  // ... existing
  { name: "TeamGrid", module: TeamGrid },
];
```

### 2. Add a Feature to Existing Component

**User Request:** "Add search to PostsListing"

**AI Steps:**

1. Make `PostsListing.client.tsx` handle search
2. Add search state
3. Filter posts based on input
4. Keep infinite scroll working

### 3. Create a Domain Helper

**User Request:** "Fetch products with category filtering"

**AI Steps:**

1. **Create interface** (`lib/types/IProduct.ts`)
2. **Create helper** (`lib/cms-content/getProductListing.ts`):
```typescript
import { getContentList } from "@/lib/cms/getContentList";
import { IProduct } from "@/lib/types/IProduct";

export async function getProductListing({
  category,
  take = 20,
  skip = 0,
}: {
  category?: string;
  take?: number;
  skip?: number;
}) {
  const products = await getContentList<IProduct>({
    referenceName: "products",
    languageCode: "en-us",
    take,
    skip,
    sort: "fields.name",
    direction: "asc",
    filter: category ? `fields.category[eq]${category}` : undefined,
  });

  return { products };
}
```

### 4. Extend TypeScript Interfaces

**User Request:** "Add URL to Post interface"

**AI Steps:**

Update `lib/types/IPost.ts`:
```typescript
export interface IPost {
  // ... existing fields
  url?: string;  // Computed field
}
```

### 5. Create Page Template

**User Request:** "Create a sidebar layout template"

**AI Steps:**

Create `components/agility-pages/SidebarTemplate.tsx`:
```typescript
import { ContentZone } from "@agility/nextjs";
import { getModule } from "../agility-components";

export default function SidebarTemplate({ page }) {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContentZone
            name="MainContent"
            page={page}
            getModule={getModule}
          />
        </div>
        <aside className="lg:col-span-1">
          <ContentZone
            name="Sidebar"
            page={page}
            getModule={getModule}
          />
        </aside>
      </div>
    </div>
  );
}
```

Register in `components/agility-pages/index.ts`:
```typescript
import SidebarTemplate from "./SidebarTemplate";

const allPageTemplates = {
  MainTemplate,
  SidebarTemplate,
};
```

## Key Patterns to Remember

### 1. Server Component by Default

```typescript
// Default - async server component
export default async function MyComponent({ module }) {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

Only use `"use client"` when:
- Need user interaction
- Need React hooks
- Need browser APIs

### 2. Layer Separation

```
Component → Domain Helper → CMS Utility → Agility SDK
```

Don't skip layers - keeps code maintainable.

### 3. Type Everything

```typescript
// Good
const post = await getContentItem<IPost>({ ... });

// Bad
const post: any = await getContentItem({ ... });
```

### 4. Dark Mode Always

```typescript
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### 5. Responsive Design

```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Common AI Prompts

### Create Component
```
Create a [ComponentName] component that:
- Fetches [data] from "[container]" container
- Displays in a [layout description]
- Supports dark mode
- Follows the same pattern as [ExistingComponent]
```

### Add Feature
```
Add [feature] to [Component]:
- [Requirement 1]
- [Requirement 2]
- Maintain existing functionality
```

### Fix Issue
```
The [Component] is not [working correctly].
Looking at the code, fix the issue while:
- Maintaining existing functionality
- Following project patterns
- Adding proper error handling
```

### Extend Type
```
Update the I[Model] interface to include:
- [field1]: [type]
- [field2]: [type]
Then update [Component] to use the new fields.
```

## Debugging Tips for AI

### Component Not Rendering

1. Check it's registered in `components/agility-components/index.ts`
2. Verify name matches Agility CMS exactly (case-sensitive)
3. Check for TypeScript errors
4. Verify module.contentid exists

### Data Not Showing

1. Log the data: `console.log('Fields:', fields);`
2. Check field names match CMS model
3. Verify content is published in Agility CMS
4. Check TypeScript interface matches

### Styling Issues

1. Dark mode classes present?
2. Responsive classes added?
3. Tailwind classes correct?
4. Check for typos in className

## File Templates

### Content Model Interface
```typescript
// lib/types/IModelName.ts
export interface IModelName {
  contentID: number;
  // ... fields
}
```

### Component Model Interface
```typescript
// Inline in component file
interface IMyComponentModule {
  heading: string;
  // ... fields
}
```

### Server Component
```typescript
import { UnloadedModuleProps } from "@agility/nextjs";
import { getContentItem } from "@/lib/cms/getContentItem";

interface IMyModule {
  // fields
}

export default async function MyComponent({
  module,
  languageCode,
}: UnloadedModuleProps) {
  const { fields } = await getContentItem<IMyModule>({
    contentID: module.contentid,
    languageCode,
  });

  return <div>{fields.heading}</div>;
}
```

### Client Component
```typescript
"use client";

import { useState } from "react";

export default function MyClientComponent({ initialData }) {
  const [state, setState] = useState(initialData);

  return <div onClick={() => setState(!state)}>Interactive</div>;
}
```

### Domain Helper
```typescript
// lib/cms-content/getMyData.ts
import { getContentList } from "@/lib/cms/getContentList";
import { IMyModel } from "@/lib/types/IMyModel";

export async function getMyData({
  take = 10,
  skip = 0,
}: {
  take?: number;
  skip?: number;
}) {
  const items = await getContentList<IMyModel>({
    referenceName: "mycontainer",
    languageCode: "en-us",
    take,
    skip,
  });

  return { items };
}
```

## Advanced Reference

For complex features beyond this starter:

**[Next.js Demo Site 2025](https://github.com/agility/nextjs-demo-site-2025)**

Includes:
- AI search with streaming
- Multi-locale (3+ languages)
- Personalization
- A/B testing
- 27+ components

Use it as reference:
```
Looking at nextjs-demo-site-2025's [Feature],
implement similar functionality here.
```

## Quick Links

- **Architecture**: `docs/ARCHITECTURE.md`
- **CMS Guide**: `docs/AGILITY-CMS-GUIDE.md`
- **Components**: `docs/COMPONENTS.md`
- **Content Models**: `docs/CONTENT-MODELS.md`

---

**Remember:** This project uses Next.js 15 App Router with React Server Components. Always default to server components unless client interactivity is required.
