const fs = require('fs');

const file = fs.readFileSync('src/app/admin/DashboardClient.tsx', 'utf8');

// The shared prefix: imports and helpers
const prefixEnd = file.indexOf('export default function DashboardClient');
const prefix = file.slice(0, prefixEnd);

// Get the function body prefix (states)
const stateStart = file.indexOf('{', prefixEnd) + 1;
const returnStart = file.indexOf('  return (');
const states = file.slice(stateStart, returnStart);

// Extract tabs
const t1 = file.indexOf('{/* 4. PROJECT FORGE */}');
const t2 = file.indexOf('{/* 5. RESEARCH CODEX */}');
const t3 = file.lastIndexOf('</div>\n        </div>\n      </main>');

const projectsJsx = file.slice(t1, t2).replace(/\{activeTab === "projects" && \(\n([\s\S]*)\n\s*\)\}/, '$1');
const researchJsx = file.slice(t2, t3).replace(/\{activeTab === "research" && \(\n([\s\S]*)\n\s*\)\}/, '$1');

// Write ProjectsClient
const projectsCode = `${prefix}
export default function ProjectsClient() {
${states}
  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans">
      <header className="pb-6 border-b border-white/5 mb-8">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Project Forge</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Cpu className="w-6 h-6 text-[#00a3ff]" />
          Project Forge
        </h1>
      </header>
      ${projectsJsx}
    </div>
  );
}
`;
fs.writeFileSync('src/app/admin/(dashboard)/projects/ProjectsClient.tsx', projectsCode);

// Write ResearchClient
const researchCode = `${prefix}
export default function ResearchClient() {
${states}
  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans">
      <header className="pb-6 border-b border-white/5 mb-8">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Research Codex</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#00a3ff]" />
          Research Codex
        </h1>
      </header>
      ${researchJsx}
    </div>
  );
}
`;
fs.writeFileSync('src/app/admin/(dashboard)/research/ResearchClient.tsx', researchCode);
