import type { Locale } from "@/lib/i18n";

type Localized<T = string> = Record<Locale, T>;

export type Project = {
  slug: string;
  code: string;
  year: string;
  location: Localized;
  status: Localized;
  typology: Localized;
  title: Localized;
  dek: Localized;
  body: Localized<string[]>;
  image: string;
  imageAlt: Localized;
  heroImage: string;
  credit: string;
  gallery: ProjectMedia[];
  videoUrl?: string;
};

export type JournalEntry = {
  slug: string;
  date: string;
  category: Localized;
  title: Localized;
  dek: Localized;
  image: string;
  imageAlt: Localized;
};

export type ProjectMedia = {
  src: string;
  alt: Localized;
  credit?: string;
};

export const navigation: Record<Locale, { label: string; href: string }[]> = {
  zh: [
    { label: "项目", href: "/projects" },
    { label: "实践", href: "/#practice" },
    { label: "日志", href: "/journal" },
    { label: "影像", href: "/#films" },
    { label: "联系", href: "/#contact" }
  ],
  en: [
    { label: "Projects", href: "/projects" },
    { label: "Practice", href: "/#practice" },
    { label: "Journal", href: "/journal" },
    { label: "Films", href: "/#films" },
    { label: "Contact", href: "/#contact" }
  ]
};

export const home = {
  hero: {
    kicker: {
      zh: "建筑事务所 / 上海 / 长期档案",
      en: "Architecture Practice / Shanghai / Living Archive"
    },
    title: {
      zh: "Mist Architect",
      en: "Mist Architect"
    },
    deck: {
      zh: "以雾、光、结构和城市记忆为线索，记录空间从概念到建成的过程。",
      en: "Tracing space through mist, light, structure, and civic memory from concept to construction."
    },
    primaryCta: {
      zh: "查看项目",
      en: "View Projects"
    },
    secondaryCta: {
      zh: "阅读日志",
      en: "Read Journal"
    },
    poster:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85",
    video:
      "https://cdn.pixabay.com/video/2022/02/02/106340-673544770_large.mp4"
  },
  indexLabel: {
    zh: "项目索引",
    en: "Project Index"
  },
  journalLabel: {
    zh: "近期更新",
    en: "Recent Notes"
  },
  practice: {
    label: {
      zh: "实践",
      en: "Practice"
    },
    title: {
      zh: "把建筑看作可阅读的现场。",
      en: "Architecture as a readable site."
    },
    copy: {
      zh: "Mist Architect 关注建筑、室内、城市更新与材料研究，以清晰的空间秩序回应复杂的场地条件。",
      en: "Mist Architect works across architecture, interiors, adaptive reuse, and material research with spatial clarity as its operating discipline."
    }
  },
  films: {
    label: {
      zh: "影像",
      en: "Films"
    },
    title: {
      zh: "施工、模型、光线和日常尺度。",
      en: "Construction, models, light, and daily scale."
    },
    copy: {
      zh: "影像栏目为项目短片、现场记录和访谈预留结构，后续可由 CMS 持续更新。",
      en: "The films section is prepared for project shorts, site records, and conversations that can be updated through the CMS later."
    }
  },
  contact: {
    label: {
      zh: "联系",
      en: "Contact"
    },
    title: {
      zh: "新的场地、改造计划或研究合作。",
      en: "New sites, adaptive reuse plans, and research collaborations."
    },
    email: "studio@mistarchitect.com"
  }
};

export const projects: Project[] = [
  {
    slug: "cloud-court-house",
    code: "MST-024",
    year: "2026",
    location: {
      zh: "杭州，中国",
      en: "Hangzhou, China"
    },
    status: {
      zh: "设计深化",
      en: "Design Development"
    },
    typology: {
      zh: "住宅 / 庭院",
      en: "Residential / Courtyard"
    },
    title: {
      zh: "云院",
      en: "Cloud Court House"
    },
    dek: {
      zh: "一个围绕天井、雨水和半透明边界组织的低层住宅。",
      en: "A low-rise residence organized around courtyards, rainwater, and translucent edges."
    },
    body: {
      zh: [
        "项目以连续的院落组织生活动线，让光线、风和雨水成为日常空间的一部分。",
        "外墙保持低调的矿物质感，室内使用深色木作和白色墙面形成清晰对比。"
      ],
      en: [
        "The project uses connected courtyards to make light, air, and rainwater part of daily circulation.",
        "A quiet mineral exterior is paired with dark timber interiors and white planes for a measured contrast."
      ]
    },
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85",
    heroImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2400&q=85",
    imageAlt: {
      zh: "被树木环绕的现代住宅",
      en: "Modern residence surrounded by trees"
    },
    credit: "Unsplash",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "带有木质家具的住宅室内",
          en: "Residential interior with timber furniture"
        },
        credit: "Unsplash"
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "现代住宅中的楼梯与自然光",
          en: "Stair and daylight inside a modern residence"
        },
        credit: "Unsplash"
      }
    ],
    videoUrl: "https://cdn.pixabay.com/video/2022/02/02/106340-673544770_large.mp4"
  },
  {
    slug: "river-archive",
    code: "MST-021",
    year: "2025",
    location: {
      zh: "苏州，中国",
      en: "Suzhou, China"
    },
    status: {
      zh: "竞赛入围",
      en: "Competition Shortlist"
    },
    typology: {
      zh: "文化 / 更新",
      en: "Cultural / Adaptive Reuse"
    },
    title: {
      zh: "河岸档案馆",
      en: "River Archive"
    },
    dek: {
      zh: "旧仓库被改造为面向河岸开放的城市档案与展览空间。",
      en: "A warehouse is reworked into a civic archive and exhibition hall opening toward the river."
    },
    body: {
      zh: [
        "既有结构被保留为公共记忆的框架，新插入的轻质盒体承担展览、阅读和社区活动。",
        "立面通过可开启金属格栅调节日照，也让建筑在白天和夜晚呈现不同厚度。"
      ],
      en: [
        "The existing structure remains as a framework of civic memory, while inserted lightweight volumes hold exhibitions, reading rooms, and community programs.",
        "Operable metal screens temper sunlight and give the facade different densities between day and night."
      ]
    },
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=85",
    heroImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=2400&q=85",
    imageAlt: {
      zh: "几何立面和蓝天",
      en: "Geometric facade against blue sky"
    },
    credit: "Unsplash",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "城市中的建筑立面",
          en: "Architectural facade in the city"
        },
        credit: "Unsplash"
      },
      {
        src: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "高层建筑的结构细部",
          en: "Structural details of a high-rise facade"
        },
        credit: "Unsplash"
      }
    ]
  },
  {
    slug: "north-light-studio",
    code: "MST-018",
    year: "2024",
    location: {
      zh: "上海，中国",
      en: "Shanghai, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "办公 / 室内",
      en: "Workplace / Interior"
    },
    title: {
      zh: "北光工作室",
      en: "North Light Studio"
    },
    dek: {
      zh: "将一层厂房改造为用于模型、材料与小型发布的复合工作空间。",
      en: "A ground-floor factory bay becomes a combined workspace for models, materials, and small presentations."
    },
    body: {
      zh: [
        "连续天窗提供稳定北向光，工作台、档案柜和展示墙被整合为一套线性基础设施。",
        "项目尽量保留原有混凝土和钢构痕迹，让工作过程成为空间的主要表情。"
      ],
      en: [
        "Continuous skylights provide stable northern light while worktables, archives, and display walls become one linear infrastructure.",
        "Existing concrete and steel traces are kept visible so the act of working becomes the room's primary expression."
      ]
    },
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85",
    heroImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2400&q=85",
    imageAlt: {
      zh: "明亮的现代办公室室内",
      en: "Bright modern office interior"
    },
    credit: "Unsplash",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "带长桌的共享工作室",
          en: "Shared studio with long worktables"
        },
        credit: "Unsplash"
      },
      {
        src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85",
        alt: {
          zh: "带自然光的室内空间",
          en: "Interior space with natural light"
        },
        credit: "Unsplash"
      }
    ]
  }
];

export const journalEntries: JournalEntry[] = [
  {
    slug: "wired-grid-for-architecture",
    date: "2026-04-13",
    category: {
      zh: "设计系统",
      en: "Design System"
    },
    title: {
      zh: "把编辑网格转译为建筑档案",
      en: "Translating an Editorial Grid into an Architectural Archive"
    },
    dek: {
      zh: "第一版界面把 WIRED 式出版秩序转化为项目索引、图像叙事和持续更新机制。",
      en: "The first interface translates WIRED-like publishing discipline into project indexes, image narratives, and updateable content."
    },
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    imageAlt: {
      zh: "建筑工作室办公空间",
      en: "Architecture studio workspace"
    }
  },
  {
    slug: "future-cms-language-model",
    date: "2026-04-13",
    category: {
      zh: "内容架构",
      en: "Content Architecture"
    },
    title: {
      zh: "为中文、英文和未来语言预留内容结构",
      en: "Preparing Content for Chinese, English, and Future Locales"
    },
    dek: {
      zh: "项目、日志和影像都会以 locale 前缀进入路由，之后可对接文档级多语言 CMS。",
      en: "Projects, journal entries, and films live behind locale-prefixed routes and can later connect to a document-level multilingual CMS."
    },
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    imageAlt: {
      zh: "山地住宅和自然景观",
      en: "Mountain residence and landscape"
    }
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
