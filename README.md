# Spencer Fisher's Personal Portfolio
This is my personal software engineering portfolio. It is the central location where my projects, technical experience, current work, and professional journey are displayed.

Rather than a conventional portfolio, this site is designed as a futuristic digital operations system. The interface connects different areas of my work through an interactive network of projects, capabilities, active operations, and personal information.

## About Me
My name is Spencer Fisher, a Software Engineering student at the University of Technology Sydney with an interest in building practical, well-engineered software and exploring the growing intersection between software engineering and artificial intelligence.

My work spans full-stack development, backend systems, automation, data and machine learning, with a focus on continually expanding both my technical capabilities and engineering experience.

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Motion**
- **GSAP**
- **Mapbox**
- **CSS**
- **SVG**

## Current Features

- Interactive Central Hub network map
- Startup/boot sequence with SF operations branding
- Persistent system shell and compact minimap navigation
- Live GitHub telemetry
- Sydney time and location panel
- Sector routes for projects, capabilities, personnel, operations, and communications

## Explore

**Portfolio:** TBC

**LinkedIn:** https://www.linkedin.com/in/spencer-fisher/ 

**GitHub:** https://github.com/spncr1

## Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev -- -H 127.0.0.1 -p 3001
```

Then open:

```text
http://127.0.0.1:3001
```

Required local environment variables live in `.env.local`:

```text
GITHUB_USERNAME
GITHUB_TOKEN
MAPBOX_ACCESS_TOKEN
NEXT_PUBLIC_MAPBOX_TOKEN
```

Build and lint checks:

```bash
npm run lint
npm run build
```

## Deployment

The intended deployment target is Vercel.
