export const projectsData = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with Next.js, featuring product catalogs, a shopping cart, and a secure checkout process.",
    imageId: "ov-project-1",
    tags: ["Next.js", "React", "Stripe", "PostgreSQL"],
    githubUrl: "https://github.com",
    demoUrl: "https://vercel.com",
  },
  {
    id: "project-2",
    title: "Task Management App",
    description: "A collaborative task management application that helps teams organize, track, and manage their work.",
    imageId: "ov-project-2",
    tags: ["React", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com",
    demoUrl: "https://netlify.com",
  },
  {
    id: "project-3",
    title: "Portfolio Website API",
    description: "A headless CMS and API backend for a portfolio website, built with Node.js and Express, served via Docker.",
    imageId: "ov-project-3",
    tags: ["Node.js", "Express", "Docker", "REST API"],
    githubUrl: "https://github.com",
    demoUrl: null,
  },
];

export const blogPostsData = [
  {
    slug: "mastering-react-hooks",
    title: "Mastering React Hooks: A Deep Dive",
    summary: "Explore the power of React Hooks and learn how to write cleaner, more reusable component logic.",
    content: `
      <p>React Hooks revolutionized how we write functional components. In this post, we'll go beyond useState and useEffect to explore hooks like useReducer, useCallback, useMemo, and useRef.</p>
      <h2>Why Hooks?</h2>
      <p>Before Hooks, sharing stateful logic between components was a challenge, often leading to patterns like Higher-Order Components (HOCs) or render props, which could create "wrapper hell." Hooks allow you to extract stateful logic so it can be tested independently and reused.</p>
      <h3>useReducer: For Complex State</h3>
      <p>When you have complex state logic that involves multiple sub-values or when the next state depends on the previous one, <code>useReducer</code> can be a better choice than <code>useState</code>.</p>
      <pre><code>const [state, dispatch] = useReducer(reducer, initialState);</code></pre>
      <blockquote>It's often preferred in components with many state updates that might benefit from a centralized action-based management system.</blockquote>
    `,
    date: "2023-10-26",
    imageId: "ov-blog-1",
  },
  {
    slug: "the-art-of-collaboration-in-tech",
    title: "The Art of Collaboration in Tech Teams",
    summary: "Effective collaboration is key to successful software projects. Here are some strategies for fostering a collaborative environment.",
    content: `
      <p>In the world of software development, code is only part of the equation. How a team communicates, shares knowledge, and works together is just as crucial for success. This post explores the soft skills and tools that can make or break a project.</p>
      <h2>Key Pillars of Collaboration</h2>
      <ul>
        <li><strong>Clear Communication:</strong> Whether it's through Slack, comments in code, or daily stand-ups, clear and concise communication is paramount.</li>
        <li><strong>Code Reviews:</strong> A constructive code review process not only improves code quality but also serves as a powerful knowledge-sharing tool.</li>
        <li><strong>Pair Programming:</strong> Working in pairs can lead to better solutions and faster learning, especially for complex problems or when onboarding new team members.</li>
      </ul>
      <p>Building a culture of trust and respect is the foundation upon which all successful collaboration is built.</p>
    `,
    date: "2023-09-15",
    imageId: "ov-blog-2",
  },
  {
    slug: "getting-started-with-nextjs-14",
    title: "Getting Started with Next.js 14 and the App Router",
    summary: "A beginner's guide to building a modern web application with the latest features in Next.js, including the App Router.",
    content: `
      <p>Next.js continues to be a dominant force in the React ecosystem. With the introduction of the App Router, it has embraced server-side rendering and static site generation in new and powerful ways.</p>
      <h2>Setting Up Your First Project</h2>
      <p>Getting started is as simple as running a single command:</p>
      <pre><code>npx create-next-app@latest</code></pre>
      <p>This will scaffold a new project with all the necessary configurations. We'll walk through the new directory structure, including layouts, pages, and loading states.</p>
      <h3>Server Components vs. Client Components</h3>
      <p>One of the biggest shifts is the "React Server Components" paradigm. By default, components in the App Router are Server Components, which run only on the server. This reduces the amount of JavaScript sent to the client, leading to faster initial page loads.</p>
      <p>To create a client-side interactive component, you simply add the "use client" directive at the top of the file.</p>
    `,
    date: "2023-11-05",
    imageId: "ov-blog-3",
  },
];
