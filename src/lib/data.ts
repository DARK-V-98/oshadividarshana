
import { Crown, Sparkles, Scissors, BookMarked } from "lucide-react";

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

export const moduleCategories = [
  {
    id: "bridal",
    name: "Bridal Dresser",
    description: "Master the art of bridal makeup, hair styling, and saree draping. Includes traditional and modern techniques.",
    href: "/courses/bridal",
    icon: Crown,
    color: "from-primary to-rose-dark",
    modules: [
        { code: "BD-M01", title: "Special Qualities to be Inculcated & Attitudes to be Developed", sinhala: "රූපලාවන්‍ය ශිල්පියෙකුට වර්ධනය කළ යුතු විශේෂ ගුණාංග සහ ආකල්ප" },
        { code: "BD-M02", title: "Analyse Skin", sinhala: "සම විශ්ලේෂණය" },
        { code: "BD-M03", title: "Facial", sinhala: "මුහුණු සත්කාර" },
        { code: "BD-M05", title: "Remove Superfluous Hair", sinhala: "අනවශ්‍ය රෝම ඉවත් කිරීම" },
        { code: "BD-M06", title: "Care Hands & Nails (Manicure)", sinhala: "අත් අලංකරණය" },
        { code: "BD-M07", title: "Care Feet & Nails (Pedicure)", sinhala: "පා අලංකරණය" },
        { code: "BD-M08", title: "Shampoo & conditioning hair", sinhala: "Shampoo කිරීම සහ condition කිරීම" },
        { code: "BD-M09", title: "Treat Scalp & Hair", sinhala: "හිසකෙස් සත්කාර" },
        { code: "BD-M10", title: "Style Hair and techniques", sinhala: "කොණ්ඩා මෝස්තර සහ තාක්ෂණය" },
        { code: "BD-M10-2", title: "Hair setting techniques", sinhala: "කොණ්ඩා සැකසුම් සහ තාක්ෂණය" },
        { code: "BD-M11", title: "Makeup", sinhala: "මේකප්" },
        { code: "BD-M12", title: "Bridal attire and its draping", sinhala: "මංගල ඇදුම් සහ එය ඇන්දවීම" },
        { code: "BD-M13", title: "Bridal dresser", sinhala: "මනාලියන් ඇන්දවීම" },
        { code: "BD-M14", title: "Occupational Health & Safety", sinhala: "සෞඛ්‍ය සහ ආරක්ෂාව" },
        { code: "BD-M15", title: "Client Consultation", sinhala: "සේවාලාභී උපදේශනය" },
        { code: "BD-M16", title: "Management of Salon", sinhala: "රූපලාවන්‍යාගාර කළමනාකරණය" },
        { code: "BD-M17", title: "Maintenance of machinery, tools and equipment", sinhala: "මැෂින් සහ උපකරණ නඩත්තුව" },
        { code: "BD-M18", title: "Practice workplace communication and interpersonal relation", sinhala: "වෘත්තීය සන්නිවේදනය සහ අන්තර් පුද්ගල සම්බන්ධතා" },
        { code: "BD-M19", title: "Apply occupational literary and numaracy", sinhala: "සාක්ෂරතාවය සහ සංඛ්‍යාත්මකතාව" },
        { code: "BD-M20", title: "Work in team", sinhala: "කණ්ඩායමක් ලෙස වැඩ කිරීම" },
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    description: "Comprehensive modules on skin care, facials, manicure, pedicure, and other essential beauty treatments.",
    href: "/courses/beauty",
    icon: Sparkles,
    color: "from-rose-medium to-primary",
    modules: [
        { code: "BM 01", title: "Special Qualities & Attitudes for a Beautician", sinhala: "රූපලාවන්‍ය ශිල්පියෙකුට වර්ධනය කළ යුතු විශේෂ ගුණාංග සහ ආකල්ප" },
        { code: "BM 02", title: "Maintain Tools & Equipment", sinhala: "මෙවලම් සහ උපකරණ නඩත්තු කිරීම" },
        { code: "BM 03", title: "Practice Occupational Health & Safety Measures", sinhala: "වෘත්තීය සෞඛ්‍ය සහ ආරක්ෂිත ක්‍රියාමාර්ග" },
        { code: "M01", title: "Maintain Safe & Pleasant Salon Environment", sinhala: "ආරක්ෂිත සහ සුහද රූපලාවන්‍යාගාර පරිසරය නඩත්තතුව" },
        { code: "M02", title: "Reception Duties", sinhala: "පිළිගැනීමේ රාජකාරි" },
        { code: "M03", title: "Client Consultation", sinhala: "සේවාලාභී උපදේශනය" },
        { code: "M04", title: "Remove Superfluous Hair", sinhala: "අනවශ්‍ය රෝම ඉවත් කිරීම" },
        { code: "M05", title: "Perform Make-up Activities", sinhala: "මේකප්" },
        { code: "M06", title: "Manicure & Pedicure", sinhala: "අත් අලංකරණය සහ පා අලංකරණය" },
        { code: "M07", title: "Analyze Skin", sinhala: "සම විශ්ලේෂණය" },
        { code: "M08", title: "Skin Care Treatments (facial)", sinhala: "සම් සත්කාර ප්‍රතිකාර" },
        { code: "M08-2", title: "Salon Management", sinhala: "රූපලාවන්‍යාගාර කළමනාකරණය" },
    ],
  },
  {
    id: "hair",
    name: "Hair Dresser",
    description: "Learn professional hair cutting, coloring, and styling techniques for all types of hair.",
    href: "/courses/hair",
    icon: Scissors,
    color: "from-gold to-primary",
    modules: [
        { code: "HD-M01", title: "Special qualities & attitudes to be developed by a Hairdresser", sinhala: "කොණ්ඩ මෝස්තර ශිල්පියෙකු විසින් ප්‍රගුණ කළ යුතු ගුණාංග" },
        { code: "HD-M02", title: "Maintain Machinery, Tools and Equipment", sinhala: "යන්ත්‍ර, උපකරණ හා භාණ්ඩ නඩත්තුව" },
        { code: "HD-M03", title: "Shampoo & conditioning hair", sinhala: "හිසකෙස් shampoo කිරීම හා condition කිරීම" },
        { code: "HD-M04", title: "Maintain safe & pleasant salon environment", sinhala: "පරිසර නඩත්තුව" },
        { code: "HD-M05", title: "Client’s consultation services", sinhala: "සේවාලාභී උපදේශනය" },
        { code: "HD-M06", title: "Hair & scalp treatments", sinhala: "හිසකෙස් සහ scalp සත්කාර" },
        { code: "HD-M07", title: "Cutting & setting ladies hair", sinhala: "කාන්තා හිසකෙස් කැපීම හා සැකසීම" },
        { code: "HD-M08", title: "Cutting & setting men's hair, moustache & beard", sinhala: "පිරිමි හිසකෙස් කැපීම හා සැකසීම සහ රැවුල" },
        { code: "HD-M09", title: "Styling & dressing hair", sinhala: "හිසකෙස් මෝස්තර හා සැකසීම" },
        { code: "HD-M10", title: "Permanent wave (perm)", sinhala: "පර්ම් කිරීම" },
        { code: "HD-M11", title: "Relaxing / straightening services", sinhala: "හිසකෙස් කෙලින් කිරීම / relaxing" },
        { code: "HD-M12", title: "Colour hair", sinhala: "හිසකෙස් වර්ණ කිරීම" },
        { code: "HD-M13", title: "Promotion & selling hair care products & services", sinhala: "නිෂ්පාදන ප්‍රවර්ධන හා විකිණීම" },
        { code: "HD-M14", title: "Hairdressing salon management", sinhala: "සැලෝන් කළමනාකරණය" },
        { code: "HD-BM01", title: "Communication skills for workplace", sinhala: "රැකියා ස්ථාන සහ සන්නිවේදන කුසලතා" },
        { code: "HD-BM02", title: "Team work", sinhala: "කණ්ඩායම් වැඩ" },
        { code: "HD-BM03", title: "Occupational Safety & Health & Environmental Aspects", sinhala: "වෘත්තීය ආරක්ෂාව, සෞඛ්‍ය හා පරීක්ෂණය" },
    ],
  },
  {
    id: "extra-notes",
    name: "Extra Notes",
    description: "Specialized notes covering salon management, health & safety, etiquette, and more to round out your skills.",
    href: "/courses/extra-notes",
    icon: BookMarked,
    color: "from-primary to-gold",
    modules: [
        { code: "EN-01", title: "History of Beauty", sinhala: "රූපලාවන්‍ය ඉතිහාසය" },
        { code: "EN-02", title: "History of Cosmetics", sinhala: "කේශලාවන්‍ය ඉතිහාසය" },
    ]
  }
];

type MediumType = "sinhala" | "english";

interface PricingItem {
  label: string;
  price: number;
  type: "full" | "individual" | "partial";
  count?: number;
  buttonText: string;
}

interface CategoryPricing {
  name: string;
  modules: number;
  sinhala: PricingItem[];
  english: PricingItem[];
}

export const pricingData: CategoryPricing[] = [
  {
    name: "Bridal Dresser",
    modules: 20,
    sinhala: [
      { label: "Full Note Pack (20)", price: 5800, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (20)", price: 7800, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (20)", price: 7800, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (20)", price: 9800, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
  {
    name: "Beauty",
    modules: 12,
    sinhala: [
      { label: "Full Note Pack (12)", price: 3500, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (12)", price: 4700, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (12)", price: 4600, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (12)", price: 5700, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
  {
    name: "Hair Dresser",
    modules: 17,
    sinhala: [
      { label: "Full Note Pack (17)", price: 5000, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (17)", price: 6600, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 800, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1400, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 1800, type: "partial", count: 5, buttonText: "Select Items" },
    ],
    english: [
      { label: "Full Note Pack (17)", price: 6600, type: "full", buttonText: "Add to Cart" },
      { label: "Full Assignment Pack (17)", price: 8300, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
      { label: "Assignment", price: 500, type: "individual", buttonText: "Select Item" },
      { label: "Note 3", price: 1100, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Assignment 3", price: 1400, type: "partial", count: 3, buttonText: "Select Items" },
      { label: "Note 5", price: 1900, type: "partial", count: 5, buttonText: "Select Items" },
      { label: "Assignment 5", price: 2400, type: "partial", count: 5, buttonText: "Select Items" },
    ],
  },
  {
    name: "Extra Notes",
    modules: 2,
    sinhala: [
      { label: "Full Note Pack (2)", price: 600, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 300, type: "individual", buttonText: "Select Item" },
    ],
    english: [
      { label: "Full Note Pack (2)", price: 800, type: "full", buttonText: "Add to Cart" },
      { label: "Note", price: 400, type: "individual", buttonText: "Select Item" },
    ],
  },
];

    