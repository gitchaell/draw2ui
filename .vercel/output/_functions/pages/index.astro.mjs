/* empty css                                 */
import { e as createComponent, r as renderTemplate, k as renderComponent, l as renderSlot, n as renderHead, g as addAttribute, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CXAT6cRz.mjs';
import 'piccolore';
import { Analytics } from '@vercel/analytics/react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { atom, map } from 'nanostores';
import { update, get, del, set } from 'idb-keyval';
import clsx from 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Dise\xF1a tu UI r\xE1pida y pr\xE1cticamente con IA." } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="es" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><link rel="icon" type="image/svg+xml" href="/icon.svg"><link rel="manifest" href="/manifest.json"><meta name="generator"', "><title>", '</title><meta name="description"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://fromdrawtoui.vercel.app/"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image" content="https://fromdrawtoui.vercel.app/og-image.png"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://fromdrawtoui.vercel.app/"><meta property="twitter:title"', '><meta property="twitter:description"', `><meta property="twitter:image" content="https://fromdrawtoui.vercel.app/og-image.png"><!-- Theme Script --><script>
			// Check local storage for theme, default to dark
			const theme = (() => {
				if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
					return localStorage.getItem('theme');
				}
				if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
					return 'dark';
				}
				return 'dark'; // Default
			})();

			if (theme === 'light') {
				document.documentElement.classList.remove('dark');
			} else {
				document.documentElement.classList.add('dark');
			}

			window.localStorage.setItem('theme', theme);
		<\/script>`, '</head> <body class="h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans"> ', " ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(title, "content"), addAttribute(description, "content"), renderHead(), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Analytics", Analytics, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "@vercel/analytics/react", "client:component-export": "Analytics" }));
}, "/app/src/layouts/Layout.astro", void 0);

const projectsStore = atom([]);
const currentProjectStore = atom(null);
atom(null);
const viewModeStore = atom("split");
const themeStore = atom("dark");
const settingsStore = map({
  theme: "dark",
  credits: 10
});
const setProjects = (projects) => {
  projectsStore.set(projects);
};
const setCurrentProject = (id) => {
  currentProjectStore.set(id);
};
const setViewMode = (mode) => {
  viewModeStore.set(mode);
};
const setTheme = (theme) => {
  themeStore.set(theme);
  settingsStore.get();
  settingsStore.setKey("theme", theme);
};

const PROJECTS_KEY = "draw2ui-projects";
const SETTINGS_KEY = "draw2ui-settings";
const DEFAULT_SETTINGS = {
  theme: "dark",
  // Default to dark as per plan
  credits: 10
};
const db = {
  // Project CRUD
  async getProjects() {
    return await get(PROJECTS_KEY) || [];
  },
  async createProject(name) {
    const newProject = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await update(PROJECTS_KEY, (projects = []) => [...projects, newProject]);
    await set(`project-${newProject.id}`, {
      id: newProject.id,
      elements: [],
      appState: {},
      generatedHtml: ""
    });
    return newProject;
  },
  async getProjectData(id) {
    return await get(`project-${id}`);
  },
  async updateProjectData(id, data) {
    const current = await get(`project-${id}`) || {
      id,
      elements: [],
      appState: {},
      generatedHtml: ""
    };
    await set(`project-${id}`, { ...current, ...data });
    await update(
      PROJECTS_KEY,
      (projects = []) => projects.map((p) => p.id === id ? { ...p, updatedAt: Date.now() } : p)
    );
  },
  async deleteProject(id) {
    await update(
      PROJECTS_KEY,
      (projects = []) => projects.filter((p) => p.id !== id)
    );
    await del(`project-${id}`);
  },
  // Settings
  async getSettings() {
    return await get(SETTINGS_KEY) || DEFAULT_SETTINGS;
  },
  async updateSettings(newSettings) {
    await update(SETTINGS_KEY, (current = DEFAULT_SETTINGS) => ({
      ...current,
      ...newSettings
    }));
  }
};

function ThemeToggle() {
  const theme = useStore(themeStore);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleTheme,
      className: "p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors",
      "aria-label": "Toggle theme",
      children: theme === "dark" ? (
        // Sun icon
        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" }) })
      ) : (
        // Moon icon
        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" }) })
      )
    }
  );
}

function Sidebar() {
  const projects = useStore(projectsStore);
  const currentProject = useStore(currentProjectStore);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadProjects();
  }, []);
  const loadProjects = async () => {
    try {
      const data = await db.getProjects();
      setProjects(data.sort((a, b) => b.updatedAt - a.updatedAt));
      if (data.length > 0 && !currentProject) {
        setCurrentProject(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };
  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const name = `Proyecto ${projects.length + 1}`;
      const newProject = await db.createProject(name);
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject.id);
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProject = async (e, id) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    try {
      await db.deleteProject(id);
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (currentProject === id) {
        setCurrentProject(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: clsx(
        "fixed left-0 top-0 h-full z-20 flex flex-col bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800", children: [
          isOpen && /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate", children: "draw2ui" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsOpen(!isOpen),
              className: "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500",
              title: isOpen ? "Colapsar sidebar" : "Expandir sidebar",
              children: isOpen ? /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5L8.25 12l7.5-7.5" }) }) : /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto py-4 px-2 space-y-2", children: [
          isOpen && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleCreateProject,
              disabled: loading,
              className: "w-full flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium",
              children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }),
                "Nuevo Proyecto"
              ]
            }
          ),
          !isOpen && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleCreateProject,
              disabled: loading,
              className: "w-full flex justify-center p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors",
              title: "Nuevo Proyecto",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", className: "w-5 h-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-1", children: projects.map((project) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx(
                "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                currentProject === project.id ? "bg-gray-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              ),
              onClick: () => setCurrentProject(project.id),
              title: project.name,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
                  /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-5 h-5 shrink-0", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" }) }),
                  isOpen && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate", children: project.name })
                ] }),
                isOpen && /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => handleDeleteProject(e, project.id),
                    className: "opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity",
                    title: "Eliminar",
                    children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" }) })
                  }
                )
              ]
            },
            project.id
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-gray-200 dark:border-zinc-800", children: /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center", isOpen ? "justify-between" : "justify-center"), children: [
          isOpen && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Tema" }),
          /* @__PURE__ */ jsx(ThemeToggle, {})
        ] }) })
      ]
    }
  );
}

function MobileNav() {
  const viewMode = useStore(viewModeStore);
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 md:hidden flex justify-around p-2 pb-safe", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setViewMode("draw"),
        className: clsx(
          "flex flex-col items-center gap-1 p-2 rounded-lg flex-1",
          viewMode === "draw" ? "text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-zinc-800" : "text-gray-500 dark:text-gray-400"
        ),
        children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Pizarra" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setViewMode("code"),
        className: clsx(
          "flex flex-col items-center gap-1 p-2 rounded-lg flex-1",
          viewMode === "code" ? "text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-zinc-800" : "text-gray-500 dark:text-gray-400"
        ),
        children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Código" })
        ]
      }
    )
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "draw2ui - Draw to UI with AI" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div className="flex h-screen w-screen overflow-hidden">  <div className="hidden md:block h-full relative z-20"> ${renderComponent($$result2, "Sidebar", Sidebar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/Sidebar", "client:component-export": "default" })} </div> <div className="flex-1 flex flex-col h-full relative z-10">  ${renderComponent($$result2, "Editor", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/app/src/components/Editor", "client:component-export": "default" })} </div>  ${renderComponent($$result2, "MobileNav", MobileNav, { "client:media": "(max-width: 768px)", "client:component-hydration": "media", "client:component-path": "/app/src/components/MobileNav", "client:component-export": "default" })} </div> ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
