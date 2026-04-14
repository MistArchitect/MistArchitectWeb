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

export type Founder = {
  name: Localized;
  position: Localized;
  credentials: Localized<string[]>;
};

export type AboutSection = {
  label: Localized;
  title: Localized;
  body: Localized<string[]>;
};

export type ProjectMedia = {
  src: string;
  alt: Localized;
  credit?: string;
};

export const navigation: Record<Locale, { label: string; href: string }[]> = {
  zh: [
    { label: "项目", href: "/projects" },
    { label: "岚", href: "/about" },
    { label: "日志", href: "/journal" },
    { label: "影像", href: "/#films" },
    { label: "联系", href: "/#contact" }
  ],
  en: [
    { label: "Projects", href: "/projects" },
    { label: "Mist", href: "/about" },
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
    images: [
      "/images/home/home-01.jpeg",
      "/images/home/home-02.jpeg",
      "/images/home/home-03.jpg",
      "/images/home/home-04.jpeg",
      "/images/home/home-05.jpeg",
      "/images/home/home-06.jpeg",
      "/images/home/home-07.jpeg",
      "/images/home/home-08.jpeg",
      "/images/home/home-09.jpeg",
      "/images/home/home-10.jpeg"
    ]
  },
  indexLabel: {
    zh: "推荐项目",
    en: "Featured Projects"
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

export const about = {
  heroImage: "/images/about/office.jpeg",
  foundersImage: "/images/about/founders.jpeg",
  nav: [
    {
      id: "intro",
      label: {
        zh: "简介",
        en: "Intro"
      }
    },
    {
      id: "founders",
      label: {
        zh: "创始人",
        en: "Founders"
      }
    },
    {
      id: "media",
      label: {
        zh: "媒体",
        en: "Media"
      }
    },
    {
      id: "contact",
      label: {
        zh: "联系方式",
        en: "Contact"
      }
    }
  ],
  hero: {
    kicker: {
      zh: "Mist Architect / 岚",
      en: "Mist Architect / Lan"
    },
    title: {
      zh: "岚",
      en: "Mist"
    },
    deck: {
      zh: "建筑在雾、光、结构与日常之间成形。",
      en: "Architecture formed between mist, light, structure, and daily life."
    }
  },
  intro: {
    label: {
      zh: "简介",
      en: "Intro"
    },
    title: {
      zh: "程博和李博自瑞士归国后创立「岚」并专注于创造富有情感的壮阔体验、有力场的广义建筑。我们的工作重视建筑的品质、令人沉浸的空间氛围，以及与良好生活的连接。",
      en: "Cheng Bo and Li Bo founded Mist after returning from Switzerland."
    },
    body: {
      zh: [],
      en: [
        "The studio focuses on broadly defined architecture with emotional, expansive experiences and a strong field of presence. Its work values architectural quality, immersive spatial atmosphere, and a close connection to good living."
      ]
    }
  },
  media: {
    label: {
      zh: "媒体",
      en: "Media"
    },
    title: {
      zh: "行业及获奖经历 / 出版与展览",
      en: "Awards / Publications and Exhibitions"
    },
    body: {
      zh: [
        "2025 最佳探索   卷宗Wallpaper＊特别单元·最佳新建规探索",
        "2023 年度新星   卷宗Wallpaper＊设计大奖2023 唯一入选建筑师",
        "2022 总建筑师   深圳光影艺术季，第二届",
        "2021 Gold Prize  第十一届园冶杯国际建筑奖",
        "2019 2nd Prize 全球智能芯片创新中心（合作：第伍建筑）",
        "2019 年度休闲空间大奖   第十七届国际设计传媒奖",
        "2019 最佳商业空间  台湾TID室内设计大奖",
        "2017  1st Prize  万科绿建研发展示中心",
        "2012  1st Prize  International Velux Award，西扎评选，中国选手首获金奖",
        "2012  1st Prize  TeamZero Design Award"
      ],
      en: [
        "2025 Best Exploration, Wallpaper＊ special unit",
        "2023 Rising Star, Wallpaper＊ Design Awards 2023, selected architect",
        "2022 Chief Architect, the 2nd Shenzhen Light and Shadow Art Season",
        "2021 Gold Prize, 11th Yuanye International Architecture Award",
        "2019 2nd Prize, Global Intelligent Chip Innovation Center, with Atelier V",
        "2019 Leisure Space of the Year, 17th International Design Media Award",
        "2019 Best Commercial Space, Taiwan TID Award",
        "2017 1st Prize, Vanke Green Building R&D Exhibition Center",
        "2012 1st Prize, International Velux Award, selected by Álvaro Siza",
        "2012 1st Prize, TeamZero Design Award"
      ]
    }
  },
  publications: {
    label: {
      zh: "出版/展览",
      en: "Publications / Exhibitions"
    },
    body: {
      zh: [
        "<Analoge Altneue Architektur>, Miroslav Šik 编著, 瑞士 Quart Verlag 出版社",
        "<ETH Jahrbuch>  苏黎世瑞士联邦理工大学 ETH Zürich 建筑学院出版",
        "<The Light of Tomorrow> 瑞士苏黎世联邦理工学院 ETH Zürich 建筑学院个人作品展",
        "增量美术馆，参展 PSA 上海当代艺术博物馆展览 《影之道》2023",
        "增量美术馆，参展新北市美术馆展览《建築的恐懼與療癒》2026",
        "无路城，参展深圳坪山美术馆开馆大展《未知城市》2019"
      ],
      en: [
        "Analoge Altneue Architektur, edited by Miroslav Šik, Quart Verlag, Switzerland",
        "ETH Jahrbuch, published by the Department of Architecture, ETH Zürich",
        "The Light of Tomorrow, solo work exhibition, Department of Architecture, ETH Zürich",
        "Zengliang Art Museum, The Shape of Shadow, PSA Shanghai, 2023",
        "Zengliang Art Museum, Fear and Healing in Architecture, New Taipei City Art Museum, 2026",
        "City Without Road, Unknown City, Pingshan Art Museum opening exhibition, Shenzhen, 2019"
      ]
    }
  },
  contact: {
    label: {
      zh: "联系方式",
      en: "Contact"
    },
    title: {
      zh: "新的场地、改造计划或研究合作。",
      en: "New sites, adaptive reuse plans, and research collaborations."
    },
    body: {
      zh: ["info@mist-arch.com", "上海 / 深圳"],
      en: ["info@mist-arch.com", "Shanghai / Shenzhen"]
    }
  },
  founders: [
    {
      name: {
        zh: "李博",
        en: "Li Bo"
      },
      position: {
        zh: "左侧",
        en: "Left"
      },
      credentials: {
        zh: [
          "瑞士 SIA 注册建筑师",
          "苏黎世联邦理工大学",
          "ETH Zürich 学士及硕士",
          "「建筑工房」发起人",
          "华南理工大学讲席副教授",
          "哈工大（深圳）设计导师"
        ],
        en: [
          "Swiss SIA Registered Architect",
          "ETH Zürich",
          "Bachelor and Master of Science",
          "Initiator of Architecture Workshop",
          "Chair Professor, South China University of Technology",
          "Design Tutor, Harbin Institute of Technology (Shenzhen)"
        ]
      }
    },
    {
      name: {
        zh: "程博",
        en: "Cheng Bo"
      },
      position: {
        zh: "右侧",
        en: "Right"
      },
      credentials: {
        zh: [
          "瑞士 SIA 注册建筑师",
          "同济大学 规划学士",
          "ETH Zürich 硕士",
          "「建筑工房」发起人",
          "哈工大（深圳）设计导师"
        ],
        en: [
          "Swiss SIA Registered Architect",
          "Bachelor of Planning, Tongji University",
          "Master of Science, ETH Zürich",
          "Initiator of Architecture Workshop",
          "Design Tutor, Harbin Institute of Technology (Shenzhen)"
        ]
      }
    }
  ] satisfies Founder[]
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
        "外墙保持低调的矿物质感，室内使用深色木作和白色墙面形成清晰对比。",
        "主要房间围绕不同尺度的庭院展开，形成可被季节、湿度和植物缓慢改变的居住界面。"
      ],
      en: [
        "The project uses connected courtyards to make light, air, and rainwater part of daily circulation.",
        "A quiet mineral exterior is paired with dark timber interiors and white planes for a measured contrast.",
        "Primary rooms unfold around courtyards of different scales, creating a domestic edge slowly altered by season, humidity, and planting."
      ]
    },
    image: "/images/home/home-01.jpeg",
    heroImage: "/images/home/home-01.jpeg",
    imageAlt: {
      zh: "被树木环绕的现代住宅",
      en: "Modern residence surrounded by trees"
    },
    credit: "Mist Architect Archive",
    gallery: [
      {
        src: "/images/home/home-06.jpeg",
        alt: {
          zh: "带有木质家具的住宅室内",
          en: "Residential interior with timber furniture"
        },
        credit: "Mist Architect Archive"
      },
      {
        src: "/images/home/home-07.jpeg",
        alt: {
          zh: "现代住宅中的楼梯与自然光",
          en: "Stair and daylight inside a modern residence"
        },
        credit: "Mist Architect Archive"
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
        "立面通过可开启金属格栅调节日照，也让建筑在白天和夜晚呈现不同厚度。",
        "河岸一侧被处理成连续的公共界面，让档案馆不再是封闭库房，而成为城市日常可经过、可停留的场所。"
      ],
      en: [
        "The existing structure remains as a framework of civic memory, while inserted lightweight volumes hold exhibitions, reading rooms, and community programs.",
        "Operable metal screens temper sunlight and give the facade different densities between day and night.",
        "The riverside edge becomes a continuous public interface, turning the archive from a sealed repository into a place for passing, pausing, and gathering."
      ]
    },
    image: "/images/home/home-02.jpeg",
    heroImage: "/images/home/home-02.jpeg",
    imageAlt: {
      zh: "几何立面和蓝天",
      en: "Geometric facade against blue sky"
    },
    credit: "Mist Architect Archive",
    gallery: [
      {
        src: "/images/home/home-08.jpeg",
        alt: {
          zh: "城市中的建筑立面",
          en: "Architectural facade in the city"
        },
        credit: "Mist Architect Archive"
      },
      {
        src: "/images/home/home-09.jpeg",
        alt: {
          zh: "高层建筑的结构细部",
          en: "Structural details of a high-rise facade"
        },
        credit: "Mist Architect Archive"
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
        "项目尽量保留原有混凝土和钢构痕迹，让工作过程成为空间的主要表情。",
        "模型制作、材料陈列和日常会议被放在同一条长轴上，工作室在不同时间呈现开放、安静和展示三种状态。"
      ],
      en: [
        "Continuous skylights provide stable northern light while worktables, archives, and display walls become one linear infrastructure.",
        "Existing concrete and steel traces are kept visible so the act of working becomes the room's primary expression.",
        "Model making, material display, and daily meetings are aligned along one long axis, allowing the studio to shift between open work, quiet focus, and presentation."
      ]
    },
    image: "/images/home/home-03.jpg",
    heroImage: "/images/home/home-03.jpg",
    imageAlt: {
      zh: "明亮的现代办公室室内",
      en: "Bright modern office interior"
    },
    credit: "Mist Architect Archive",
    gallery: [
      {
        src: "/images/home/home-10.jpeg",
        alt: {
          zh: "带长桌的共享工作室",
          en: "Shared studio with long worktables"
        },
        credit: "Mist Architect Archive"
      },
      {
        src: "/images/home/home-01.jpeg",
        alt: {
          zh: "带自然光的室内空间",
          en: "Interior space with natural light"
        },
        credit: "Mist Architect Archive"
      }
    ]
  },
  {
    slug: "pine-shadow-library",
    code: "MST-016",
    year: "2024",
    location: {
      zh: "成都，中国",
      en: "Chengdu, China"
    },
    status: {
      zh: "方案设计",
      en: "Concept Design"
    },
    typology: {
      zh: "文化 / 图书馆",
      en: "Cultural / Library"
    },
    title: {
      zh: "松影图书馆",
      en: "Pine Shadow Library"
    },
    dek: {
      zh: "一座以屋檐、树影和低照度阅读空间组织的社区图书馆。",
      en: "A community library shaped by deep eaves, pine shadows, and low-lit reading rooms."
    },
    body: {
      zh: [
        "图书馆被放置在旧街区与新公园之间，建筑以连续檐下空间连接阅读、等候和日常穿行。",
        "室内空间尽量降低视觉噪音，书架、长凳和窗洞被组织成缓慢展开的路径。",
        "项目关注光线进入建筑后的衰减过程，让安静成为公共建筑真正的使用功能。"
      ],
      en: [
        "The library sits between an old neighborhood and a new park, using continuous eaves to connect reading, waiting, and daily movement.",
        "Interior spaces reduce visual noise, arranging shelves, benches, and window openings as a slow sequence.",
        "The project studies how daylight softens inside the building, treating silence as an active civic program."
      ]
    },
    image: "/images/home/home-04.jpeg",
    heroImage: "/images/home/home-04.jpeg",
    imageAlt: {
      zh: "低矮建筑与树影",
      en: "Low building with tree shadows"
    },
    credit: "Mist Architect Archive",
    gallery: [
      {
        src: "/images/home/home-02.jpeg",
        alt: {
          zh: "社区图书馆的外部界面",
          en: "Exterior edge of a community library"
        },
        credit: "Mist Architect Archive"
      },
      {
        src: "/images/home/home-05.jpeg",
        alt: {
          zh: "阅读空间与自然光",
          en: "Reading space with natural light"
        },
        credit: "Mist Architect Archive"
      }
    ]
  },
  {
    slug: "salt-field-guesthouse",
    code: "MST-014",
    year: "2023",
    location: {
      zh: "厦门，中国",
      en: "Xiamen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "旅宿 / 更新",
      en: "Hospitality / Renewal"
    },
    title: {
      zh: "盐田客舍",
      en: "Salt Field Guesthouse"
    },
    dek: {
      zh: "由旧民居改造而来的小型客舍，以院墙、潮湿空气和浅色材料建立慢节奏体验。",
      en: "A small guesthouse converted from an old dwelling, shaped by courtyard walls, humid air, and pale materials."
    },
    body: {
      zh: [
        "项目保留原有院墙和屋顶轮廓，在内部重新组织客房、公共厨房和半室外休息平台。",
        "浅色抹灰、木作和局部石材共同建立克制的材料层次，让光线在一天中呈现细微变化。",
        "客舍不追求强烈的地标性，而是把海风、湿度和邻里声音纳入居住经验。"
      ],
      en: [
        "The project keeps the original courtyard walls and roof outline while reorganizing rooms, a shared kitchen, and semi-outdoor terraces.",
        "Pale plaster, timber, and selected stone create a restrained material register, allowing light to shift quietly through the day.",
        "Rather than seeking landmark presence, the guesthouse folds sea wind, humidity, and neighborhood sound into the stay."
      ]
    },
    image: "/images/home/home-05.jpeg",
    heroImage: "/images/home/home-05.jpeg",
    imageAlt: {
      zh: "浅色材料构成的庭院空间",
      en: "Courtyard space formed by pale materials"
    },
    credit: "Mist Architect Archive",
    gallery: [
      {
        src: "/images/home/home-03.jpg",
        alt: {
          zh: "改造客舍的院落视角",
          en: "Courtyard view of the renewed guesthouse"
        },
        credit: "Mist Architect Archive"
      },
      {
        src: "/images/home/home-06.jpeg",
        alt: {
          zh: "客房与半室外平台",
          en: "Guest room and semi-outdoor terrace"
        },
        credit: "Mist Architect Archive"
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
