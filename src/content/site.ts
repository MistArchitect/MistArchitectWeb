import type { Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";

type Localized<T = string> = Record<Locale, T>;

const featureAsset = (path: string) => mediaUrl(path, { width: 1920, quality: "std" });
const heroAsset = (path: string) => mediaUrl(path, { width: 2560, quality: "high" });

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
  facts?: ProjectFact[];
  sections?: ProjectSection[];
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
  positionLabel: Localized;
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

export type ProjectFact = {
  label: Localized;
  value: Localized;
};

export type ProjectSection = {
  id: string;
  navLabel: Localized;
  heading: Localized;
  body: Localized<string[]>;
  media: ProjectMedia[];
  facts?: ProjectFact[];
};

export const navigation: Record<Locale, { label: string; href: string }[]> = {
  zh: [
    { label: "关于", href: "/about" }
  ],
  en: [
    { label: "About", href: "/about" }
  ]
};

/**
 * Homepage hero carousel slides.
 *
 * Each slide provides both a horizontal (landscape) and a vertical
 * (portrait) source, resolved against the OSS bucket at runtime by
 * `mediaUrl()`. The Hero component picks the variant that matches the
 * active viewport orientation so desktop visitors get the wide frame
 * and mobile visitors get the tall frame without a forced crop.
 *
 * Filenames follow the pattern `NN[.N] <caption>.ext` inside the
 * bucket. The leading sequence number is metadata only and is stripped
 * from the caption here. English captions mirror the Chinese caption
 * so translators can revise them in one place.
 */
export type HeroSlide = {
  id: string;
  /**
   * 4:3 horizontal master. Served on iPad / near-square viewports
   * (the "standard" aspect band). Also acts as the fallback for the
   * "wide" band when no `horizontalWide` is provided — the hero
   * pipeline then server-crops it to 16:9 via OSS `m_fill`.
   */
  horizontal: string;
  /**
   * Optional pre-shot 16:9 horizontal master. When present, wide
   * desktop viewports get this file directly (no server crop), so
   * the photographer's intended 16:9 framing is preserved instead
   * of a center-crop guess from the 4:3 source.
   */
  horizontalWide?: string;
  vertical: string;
  caption: Localized;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "dream-factory",
    horizontal: "home/horizontal/01 深圳·梦工场·青年实验剧场.jpg",
    vertical: "home/vertical/01 深圳 · 梦工场剧场.jpeg",
    caption: {
      zh: "深圳 · 梦工场 · 青年实验剧场",
      en: "Shenzhen · Dream Factory · Experimental Theater"
    }
  },
  {
    id: "wanzhi-natural-museum",
    // Photographer supplied hand-framed 4:3 + 16:9 masters. Kept the
    // original `012 …` file in OSS for reference but the site now
    // serves the explicit `_4:3` / `_16:9` crops.
    horizontal: "home/horizontal/12_4:3 深圳 ·万致天地·自然博物园.jpg",
    horizontalWide: "home/horizontal/12_16:9_深圳 ·万致天地·自然博物园.jpg",
    vertical: "home/vertical/012 深圳 ·万致天地·自然博物园.jpg",
    caption: {
      zh: "深圳 · 万致天地 · 自然博物园",
      en: "Shenzhen · Wanzhi Tiandi · Natural Museum"
    }
  },
  {
    id: "wanzhi-natural-museum-02",
    horizontal: "home/horizontal/12.1_4:3_深圳 ·万致天地·自然博物园.jpg",
    horizontalWide: "home/horizontal/12.1_16:9_深圳 ·万致天地·自然博物园.jpg",
    // Vertical-set variant: vertical 012 is reused — only one
    // portrait crop exists for this project.
    vertical: "home/vertical/012 深圳 ·万致天地·自然博物园.jpg",
    caption: {
      zh: "深圳 · 万致天地 · 自然博物园",
      en: "Shenzhen · Wanzhi Tiandi · Natural Museum"
    }
  },
  {
    id: "field-academy",
    horizontal: "home/horizontal/02 苏州 · 原野学社.jpeg",
    vertical: "home/vertical/02 苏州 · 原野学社.jpeg",
    caption: {
      zh: "苏州 · 原野学社",
      en: "Suzhou · Field Academy"
    }
  },
  {
    id: "field-academy-02",
    // Horizontal variant repeats the base file — no additional
    // landscape crop in OSS for this project.
    horizontal: "home/horizontal/02 苏州 · 原野学社.jpeg",
    vertical: "home/vertical/02.1 苏州 · 原野学社.jpeg",
    caption: {
      zh: "苏州 · 原野学社",
      en: "Suzhou · Field Academy"
    }
  },
  {
    id: "wujingkui-ruins-garden",
    horizontal: "home/horizontal/03 惠州 · 五经魁废墟花园.jpg",
    vertical: "home/vertical/03 惠州 · 五经魁废墟花园.jpg",
    caption: {
      zh: "惠州 · 五经魁废墟花园",
      en: "Huizhou · Wujingkui Ruins Garden"
    }
  },
  {
    id: "pavilion-of-light",
    horizontal: "home/horizontal/04 深圳 · 光之展亭.jpeg",
    vertical: "home/vertical/04 深圳 · 光之展亭.jpeg",
    caption: {
      zh: "深圳 · 光之展亭",
      en: "Shenzhen · Pavilion of Light"
    }
  },
  {
    id: "light-encounter-theater",
    horizontal: "home/horizontal/05 深圳 · 光遇剧场.jpeg",
    vertical: "home/vertical/05 深圳 · 光遇剧场.jpeg",
    caption: {
      zh: "深圳 · 光遇剧场",
      en: "Shenzhen · Light Encounter Theater"
    }
  },
  {
    id: "teastone-mixc",
    horizontal: "home/horizontal/06 杭州 · 万象城 tea’stone.jpeg",
    vertical: "home/vertical/06 杭州 · 万象城 tea’stone.jpeg",
    caption: {
      zh: "杭州 · 万象城 tea’stone",
      en: "Hangzhou · MixC tea’stone"
    }
  },
  {
    id: "bambu-lab-first-store",
    horizontal: "home/horizontal/07 深圳 · 拓竹科技首店.jpeg",
    vertical: "home/vertical/07 深圳 · 拓竹科技首店.jpeg",
    caption: {
      zh: "深圳 · 拓竹科技首店",
      en: "Shenzhen · Bambu Lab First Store"
    }
  },
  {
    id: "wetland-meditation-hall",
    horizontal: "home/horizontal/08 北京 · 湿地旁的禅修馆.jpeg",
    vertical: "home/vertical/08 北京 · 湿地旁的禅修馆.jpeg",
    caption: {
      zh: "北京 · 湿地旁的禅修馆",
      en: "Beijing · Meditation Hall by the Wetland"
    }
  },
  {
    id: "ruoxian-pilates",
    horizontal: "home/horizontal/09 上海·若弦普拉提.jpg",
    vertical: "home/vertical/09 上海 · 若弦普拉提.jpeg",
    caption: {
      zh: "上海 · 若弦普拉提",
      en: "Shanghai · Ruoxian Pilates"
    }
  },
  {
    id: "stone-ruins-theater",
    horizontal: "home/horizontal/10 龙游 · 石墟剧场.jpeg",
    vertical: "home/vertical/10 龙游 · 石墟剧场.jpeg",
    caption: {
      zh: "龙游 · 石墟剧场",
      en: "Longyou · Stone Ruins Theater"
    }
  },
  {
    id: "seaside-boardwalk",
    // 4:3 master is the original `11 …` file. A photographer-framed
    // 16:9 master is also uploaded and served to wide desktops so
    // the horizon line sits where intended, not where a center-crop
    // would land.
    horizontal: "home/horizontal/11 深圳 · 海边栈道.jpg",
    horizontalWide: "home/horizontal/11_16:9_深圳 · 海边栈道.jpg",
    vertical: "home/vertical/011 深圳 · 海边栈道.jpg",
    caption: {
      zh: "深圳 · 海边栈道",
      en: "Shenzhen · Seaside Boardwalk"
    }
  },
  {
    id: "seaside-boardwalk-02",
    horizontal: "home/horizontal/11.1_4:3_深圳 · 海边栈道.jpg",
    horizontalWide: "home/horizontal/11.1_16:9_深圳 · 海边栈道.jpg",
    vertical: "home/vertical/011.1 深圳 · 海边栈道.jpg",
    caption: {
      zh: "深圳 · 海边栈道",
      en: "Shenzhen · Seaside Boardwalk"
    }
  },
  {
    id: "seaside-boardwalk-03",
    horizontal: "home/horizontal/11.2 深圳 · 海边栈道.jpg",
    vertical: "home/vertical/011.2 深圳 · 海边栈道.jpg",
    caption: {
      zh: "深圳 · 海边栈道",
      en: "Shenzhen · Seaside Boardwalk"
    }
  }
];

/**
 * Featured project tiles shown on the homepage under the hero.
 *
 * Source filenames live in `home/feature/` and embed `year·location·title`.
 * The sequence prefix is metadata only and stripped at the data layer.
 * Duplicated location fragments in source names (e.g. "深圳 · 深圳 ·…")
 * have been collapsed here so the UI is not affected by source typos.
 *
 * Tiles are currently non-clickable during prototype review. The homepage
 * renders them through `FeaturedProjectField` so the imagery can keep a
 * quiet pointer-responsive treatment without exposing detail links yet.
 */
export type FeaturedTile = {
  id: string;
  slug?: string;
  image: string;
  year: string;
  location: Localized;
  title: Localized;
  folder: {
    shell: string;
    tab: string;
    edge: string;
    stamp: string;
  };
};

export const featuredTiles: FeaturedTile[] = [
  {
    id: "dream-factory-experimental-theater",
    slug: "dream-factory-experimental-theater",
    image: "home/feature/01 2023·深圳·梦工场·青年实验剧场.jpg",
    year: "2023",
    location: { zh: "深圳", en: "Shenzhen" },
    title: {
      zh: "梦工场 · 青年实验剧场",
      en: "Dream Factory Experimental Theater"
    },
    folder: {
      shell: "#d4cab6",
      tab: "#c3b696",
      edge: "#aa9b7e",
      stamp: "#60574a"
    }
  },
  {
    id: "wanzhi-natural-history-park",
    slug: "wanzhi-natural-history-park",
    image: "home/feature/02 2024·深圳 · 深圳 ·万致天地·自然博物园.jpg",
    year: "2024",
    location: { zh: "深圳", en: "Shenzhen" },
    title: {
      zh: "万致天地 · 自然博物园",
      en: "Wanzhi Tiandi · Natural History Park"
    },
    folder: {
      shell: "#cfd4cd",
      tab: "#b9c0b5",
      edge: "#9ea696",
      stamp: "#4f5a4b"
    }
  },
  {
    id: "wujingkui-ruins-garden",
    slug: "wujingkui-ruins-garden",
    image: "home/feature/03 2025·惠州 · 五经魁废墟花园.jpg",
    year: "2025",
    location: { zh: "惠州", en: "Huizhou" },
    title: {
      zh: "五经魁废墟花园",
      en: "Wujingkui Ruins Garden"
    },
    folder: {
      shell: "#d3d0ca",
      tab: "#c2beb6",
      edge: "#aaa59c",
      stamp: "#59554f"
    }
  },
  {
    id: "pavilion-of-light",
    slug: "pavilion-of-light",
    image: "home/feature/04 2021·深圳 · 光之展亭·光影艺术季主展场.jpeg",
    year: "2021",
    location: { zh: "深圳", en: "Shenzhen" },
    title: {
      zh: "光之展亭 · 光影艺术季主展场",
      en: "Pavilion of Light · Main Hall, Light & Shadow Art Season"
    },
    folder: {
      shell: "#d3d7dc",
      tab: "#bcc5cd",
      edge: "#9fabb5",
      stamp: "#4c5663"
    }
  },
  {
    id: "bambu-lab-first-store",
    slug: "bambu-lab-first-store",
    image: "home/feature/05 2025·深圳 · 拓竹科技首店.jpeg",
    year: "2025",
    location: { zh: "深圳", en: "Shenzhen" },
    title: {
      zh: "拓竹科技首店",
      en: "Bambu Lab First Store"
    },
    folder: {
      shell: "#cbc8c0",
      tab: "#b6b5ad",
      edge: "#96958d",
      stamp: "#50504a"
    }
  },
  {
    id: "light-encounter-theater",
    slug: "light-encounter-theater",
    image: "home/horizontal/05 深圳 · 光遇剧场.jpeg",
    year: "2024",
    location: { zh: "深圳", en: "Shenzhen" },
    title: {
      zh: "光遇剧场",
      en: "Light Encounter Theater"
    },
    folder: {
      shell: "#d1d3d0",
      tab: "#bdc0bb",
      edge: "#a1a59e",
      stamp: "#535951"
    }
  },
  {
    id: "teastone-mixc",
    slug: "teastone-mixc",
    image: "home/horizontal/06 杭州 · 万象城 tea’stone.jpeg",
    year: "2024",
    location: { zh: "杭州", en: "Hangzhou" },
    title: {
      zh: "万象城 tea’stone",
      en: "MixC tea’stone"
    },
    folder: {
      shell: "#d4d1c8",
      tab: "#c2beb4",
      edge: "#aaa399",
      stamp: "#59534b"
    }
  },
  {
    id: "meditation-hall-by-the-wetland",
    slug: "meditation-hall-by-the-wetland",
    image: "home/horizontal/08 北京 · 湿地旁的禅修馆.jpeg",
    year: "2023",
    location: { zh: "北京", en: "Beijing" },
    title: {
      zh: "湿地旁的禅修馆",
      en: "Meditation Hall by the Wetland"
    },
    folder: {
      shell: "#cfd4d2",
      tab: "#b8bfbc",
      edge: "#9fa8a5",
      stamp: "#505b58"
    }
  }
];

export const home = {
  hero: {
    kicker: {
      zh: "建筑事务所 / 上海 / 长期档案",
      en: "Architecture Practice / Shanghai / Living Archive"
    },
    title: {
      zh: "MIST Architects",
      en: "MIST Architects"
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
    ],
    captions: [
      {
        zh: "深圳 · 梦工场剧场",
        en: "Shenzhen · Dream Factory Theater"
      },
      {
        zh: "苏州 · 原野学社",
        en: "Suzhou · Field Academy"
      },
      {
        zh: "惠州 · 五经魁废墟花园",
        en: "Huizhou · Wujingkui Ruins Garden"
      },
      {
        zh: "深圳 · 光之展亭",
        en: "Shenzhen · Pavilion of Light"
      },
      {
        zh: "深圳 · 光遇剧场",
        en: "Shenzhen · Light Encounter Theater"
      },
      {
        zh: "杭州 · 万象城 tea’stone",
        en: "Hangzhou · MixC tea’stone"
      },
      {
        zh: "深圳 · 拓竹科技首店",
        en: "Shenzhen · Bambu Lab First Store"
      },
      {
        zh: "北京 · 湿地旁的禅修馆",
        en: "Beijing · Meditation Hall by the Wetland"
      },
      {
        zh: "上海 · 若弦普拉提",
        en: "Shanghai · Ruoxian Pilates"
      },
      {
        zh: "龙游 · 石墟剧场",
        en: "Longyou · Stone Ruins Theater"
      }
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
      zh: "MIST Architects 关注建筑、室内、城市更新与材料研究，以清晰的空间秩序回应复杂的场地条件。",
      en: "MIST Architects works across architecture, interiors, adaptive reuse, and material research with spatial clarity as its operating discipline."
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
  // OSS bucket-relative paths. Resolved through `mediaUrl()` in components.
  //
  // About hero carousel now mirrors the homepage hero's aspect-band
  // switching: horizontal masters feed landscape + wide viewports,
  // vertical masters feed portrait phones / narrow windows. Paired by
  // index — slot N shows `aboutHero.horizontal[N]` on landscape and
  // `aboutHero.vertical[N]` on portrait so the carousel position stays
  // consistent across orientation changes. Both arrays MUST be the
  // same length.
  heroImage: "about/horizontal/about-h1.jpeg",
  aboutHero: {
    horizontal: [
      "about/horizontal/about-h1.jpeg",
      "about/horizontal/about-h2.jpeg",
      "about/horizontal/about-h3.jpeg",
      "about/horizontal/about-h4.jpeg"
    ],
    vertical: [
      "about/vertical/about-v1.jpeg",
      "about/vertical/about-v2.jpeg",
      "about/vertical/about-v3.jpeg",
      "about/vertical/about-v4.jpeg"
    ]
  },
  foundersImage: "about/founders.jpeg",
  nav: [
    {
      id: "intro",
      label: {
        zh: "岚",
        en: "MIST Architects"
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
      zh: "MIST Architects / 岚",
      en: "MIST Architects / Lan"
    },
    title: {
      zh: "岚",
      en: "MIST Architects"
    },
    deck: {
      zh: "岚·建筑设计",
      en: "MIST Architects"
    }
  },
  intro: {
    label: {
      zh: "岚",
      en: "MIST Architects"
    },
    title: {
      zh: "程博和李博自瑞士归国后创立「岚」并专注于创造富有情感的壮阔体验、有力场的广义建筑。我们的工作重视建筑的品质、令人沉浸的空间氛围，以及与良好生活的连接。",
      en: "Cheng Bo and Li Bo founded MIST Architects after returning from Switzerland."
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
    body: {
      zh: ["info@mist-arch.com"],
      en: ["info@mist-arch.com"]
    }
  },
  founders: [
    {
      name: {
        zh: "李博",
        en: "Li Bo"
      },
      position: {
        zh: "←",
        en: "←"
      },
      positionLabel: {
        zh: "图片左侧",
        en: "Left side of the image"
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
        zh: "→",
        en: "→"
      },
      positionLabel: {
        zh: "图片右侧",
        en: "Right side of the image"
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

const projectFactLabel = {
  area: {
    zh: "面积",
    en: "Area"
  },
  client: {
    zh: "委托",
    en: "Client"
  },
  team: {
    zh: "设计团队",
    en: "Design Team"
  }
} satisfies Record<string, Localized>;

function projectFacts(area: Localized, client: Localized): ProjectFact[] {
  return [
    {
      label: projectFactLabel.area,
      value: area
    },
    {
      label: projectFactLabel.client,
      value: client
    },
    {
      label: projectFactLabel.team,
      value: {
        zh: "岚·建筑设计",
        en: "MIST Architects"
      }
    }
  ];
}

export const projects: Project[] = [
  {
    slug: "dream-factory-experimental-theater",
    code: "MST-023",
    year: "2023",
    location: {
      zh: "深圳，中国",
      en: "Shenzhen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "文化 / 剧场",
      en: "Culture / Theater"
    },
    title: {
      zh: "梦工场 · 青年实验剧场",
      en: "Dream Factory Experimental Theater"
    },
    dek: {
      zh: "在城市街区内部植入一座兼具排练、演出与公共交流的青年实验剧场。",
      en: "A youth theater inserted into an urban block, combining rehearsal, performance, and public exchange."
    },
    body: {
      zh: [
        "项目将黑匣子剧场、共享前厅与开放排练空间压缩进有限场地，让青年创作与街区日常发生直接接触。",
        "观演流线被处理成一条不断展开的灰空间，观众在进入剧场前已经开始感知声响、光线与结构的变化。",
        "材料保持克制而直接：深色界面吸收舞台干扰，裸露结构与浅色工作区域则维持现场制作的清晰度。"
      ],
      en: [
        "The project compresses a black-box theater, shared foyer, and open rehearsal rooms into a tight site so young-making and street life stay in direct contact.",
        "Audience circulation unfolds through a chain of threshold spaces, allowing sound, light, and structure to register before one enters the performance room.",
        "Material decisions stay restrained and direct: dark surfaces absorb stage distraction while exposed structure and pale work zones keep the act of production legible."
      ]
    },
    image: featureAsset("home/feature/01 2023·深圳·梦工场·青年实验剧场.jpg"),
    heroImage: heroAsset("home/feature/01 2023·深圳·梦工场·青年实验剧场.jpg"),
    imageAlt: {
      zh: "梦工场青年实验剧场外观",
      en: "Dream Factory Experimental Theater exterior"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 1,260 平方米",
        en: "Approx. 1,260 sqm"
      },
      {
        zh: "文化机构 / 青年剧场计划",
        en: "Cultural Institution / Youth Theater Program"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/01 深圳·梦工场·青年实验剧场.jpg"),
        alt: {
          zh: "剧场与前厅之间的过渡空间",
          en: "Threshold between theater and foyer"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/feature/01 2023·深圳·梦工场·青年实验剧场.jpg"),
        alt: {
          zh: "青年实验剧场的主要观演空间",
          en: "Main audience and performance space of the youth theater"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "wanzhi-natural-history-park",
    code: "MST-024",
    year: "2024",
    location: {
      zh: "深圳，中国",
      en: "Shenzhen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "文化 / 展陈",
      en: "Culture / Exhibition"
    },
    title: {
      zh: "万致天地 · 自然博物园",
      en: "Wanzhi Tiandi · Natural History Park"
    },
    dek: {
      zh: "围绕城市自然教育与沉浸式展陈组织的一座复合型博物园空间。",
      en: "A hybrid museum environment organized around urban nature education and immersive exhibition."
    },
    body: {
      zh: [
        "项目通过一组相互穿插的展厅、教育空间和休憩界面，把城市商业综合体内部的行走经验重新组织为一段缓慢展开的自然叙事。",
        "界面并不追求拟态景观，而是利用尺度、光影与材料反射，让观众在连续转折中感知自然标本与环境图像之间的层次。",
        "建筑与展陈共同工作：结构边界被弱化，路径、视线与停留点被当作同一个空间系统来设计。"
      ],
      en: [
        "A series of interlocked galleries, education rooms, and pause points reorganize movement inside the commercial complex into a slower narrative about nature.",
        "Rather than mimicking scenery, the project relies on scale, shadow, and material reflection so visitors read subtle differences between specimen, image, and room.",
        "Architecture and exhibition operate together: structural boundaries are softened and path, sightline, and dwell point are treated as one spatial system."
      ]
    },
    image: featureAsset("home/feature/02 2024·深圳 · 深圳 ·万致天地·自然博物园.jpg"),
    heroImage: heroAsset("home/feature/02 2024·深圳 · 深圳 ·万致天地·自然博物园.jpg"),
    imageAlt: {
      zh: "万致天地自然博物园的主要展陈空间",
      en: "Primary exhibition space inside Wanzhi Tiandi Natural History Park"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 3,200 平方米",
        en: "Approx. 3,200 sqm"
      },
      {
        zh: "万致天地",
        en: "Wanzhi Tiandi"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/12_4:3 深圳 ·万致天地·自然博物园.jpg"),
        alt: {
          zh: "自然博物园的展厅界面",
          en: "Gallery interface inside the natural museum"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: heroAsset("home/horizontal/12.1_4:3_深圳 ·万致天地·自然博物园.jpg"),
        alt: {
          zh: "展厅中段与沉浸式观展路径",
          en: "Mid-gallery view and immersive circulation path"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "wujingkui-ruins-garden",
    code: "MST-025",
    year: "2025",
    location: {
      zh: "惠州，中国",
      en: "Huizhou, China"
    },
    status: {
      zh: "方案设计",
      en: "Concept Design"
    },
    typology: {
      zh: "遗址 / 景观",
      en: "Heritage / Landscape"
    },
    title: {
      zh: "五经魁废墟花园",
      en: "Wujingkui Ruins Garden"
    },
    dek: {
      zh: "在遗址、植被与慢速游园路径之间建立新的公共花园秩序。",
      en: "A new public garden order set between ruins, vegetation, and a deliberately slow walking route."
    },
    body: {
      zh: [
        "项目首先把遗址视作时间的容器，而非等待被完全修复的对象，因此新的介入尽量采用低姿态的路径、平台与植被组织。",
        "游园路线在碎片化墙体之间穿行，让停留、回望与穿越成为同样重要的空间行为。",
        "设计试图保留废墟的粗粝尺度，同时以轻微的边界整理和地面回应，让场地重新进入公共日常。"
      ],
      en: [
        "The project treats the ruins as a container of time rather than an object awaiting full restoration, so new work stays low and precise through paths, platforms, and planting.",
        "Circulation moves between fragmented walls so pausing, looking back, and crossing through carry equal spatial weight.",
        "The design keeps the rough scale of the ruin while using minimal ground and edge adjustments to bring the site back into public daily life."
      ]
    },
    image: featureAsset("home/feature/03 2025·惠州 · 五经魁废墟花园.jpg"),
    heroImage: heroAsset("home/feature/03 2025·惠州 · 五经魁废墟花园.jpg"),
    imageAlt: {
      zh: "五经魁废墟花园中的遗址与植被",
      en: "Ruins and vegetation inside Wujingkui Ruins Garden"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 6,800 平方米",
        en: "Approx. 6,800 sqm"
      },
      {
        zh: "文保更新计划",
        en: "Heritage Renewal Program"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/03 惠州 · 五经魁废墟花园.jpg"),
        alt: {
          zh: "废墟花园中的路径与围墙",
          en: "Path and remnant wall inside the ruins garden"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/feature/03 2025·惠州 · 五经魁废墟花园.jpg"),
        alt: {
          zh: "遗址与植物共同形成的公共花园空间",
          en: "Public garden space formed by ruin fragments and planting"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "pavilion-of-light",
    code: "MST-017",
    year: "2021",
    location: {
      zh: "深圳，中国",
      en: "Shenzhen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "展亭 / 装置",
      en: "Pavilion / Installation"
    },
    title: {
      zh: "光之展亭 · 光影艺术季主展场",
      en: "Pavilion of Light · Main Hall, Light & Shadow Art Season"
    },
    dek: {
      zh: "为城市光影艺术季构建的一座临时主展场，强调行走中的光感与结构层次。",
      en: "A temporary main venue for the city's light-and-shadow art season, shaped around luminous movement and layered structure."
    },
    body: {
      zh: [
        "展亭以半透明围护和连续桁架组织临时性的公共聚集，让白天与夜晚都形成不同强度的空间表情。",
        "参观路径并不是简单地穿过一个展棚，而是在光的密度、反射和阴影之间不断切换观看关系。",
        "临时结构被尽量做得清晰而轻，既承载展览和活动，也保留城市公共空间的开放感。"
      ],
      en: [
        "The pavilion uses translucent enclosure and a continuous truss system to create temporary public gathering with different spatial intensities across day and night.",
        "Movement is not a simple pass through a shed but a sequence of changing relations between light density, reflection, and shadow.",
        "The temporary structure stays clear and lightweight so it can host exhibitions and events without losing the openness of the civic ground."
      ]
    },
    image: featureAsset("home/feature/04 2021·深圳 · 光之展亭·光影艺术季主展场.jpeg"),
    heroImage: heroAsset("home/feature/04 2021·深圳 · 光之展亭·光影艺术季主展场.jpeg"),
    imageAlt: {
      zh: "光之展亭主展场外观",
      en: "Main venue view of the Pavilion of Light"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 1,980 平方米",
        en: "Approx. 1,980 sqm"
      },
      {
        zh: "深圳光影艺术季",
        en: "Shenzhen Light and Shadow Art Season"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/04 深圳 · 光之展亭.jpeg"),
        alt: {
          zh: "展亭中的结构与光线层次",
          en: "Structure and luminous layers inside the pavilion"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/feature/04 2021·深圳 · 光之展亭·光影艺术季主展场.jpeg"),
        alt: {
          zh: "光影艺术季主展场入口",
          en: "Entry condition to the main hall of the art season"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "bambu-lab-first-store",
    code: "MST-026",
    year: "2025",
    location: {
      zh: "深圳，中国",
      en: "Shenzhen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "零售 / 科技展示",
      en: "Retail / Tech Showroom"
    },
    title: {
      zh: "拓竹科技首店",
      en: "Bambu Lab First Store"
    },
    dek: {
      zh: "把产品体验、社群活动和技术演示组织进同一条清晰可读的首店空间。",
      en: "A first store that organizes product experience, community events, and technical demonstration within one readable retail space."
    },
    body: {
      zh: [
        "项目把品牌首店理解成一个持续运转的展示工坊，而不是单纯的商品陈列场，因此所有体验都围绕真实工作流程展开。",
        "动线清晰但并不生硬：演示区、配件墙、活动台与驻留交流区被组织为一系列逐步开放的界面。",
        "材料选择尽量降低背景噪音，让机器、模型与操作过程本身成为空间的视觉重心。"
      ],
      en: [
        "The first store is conceived as an operating workshop rather than a pure display room, so the experience is built around actual workflows and demonstrations.",
        "Circulation stays clear without becoming rigid: demo zones, accessory walls, event tables, and dwell areas open one after another.",
        "Material choices reduce background noise so the machines, prototypes, and the act of use become the visual center of the room."
      ]
    },
    image: featureAsset("home/feature/05 2025·深圳 · 拓竹科技首店.jpeg"),
    heroImage: heroAsset("home/feature/05 2025·深圳 · 拓竹科技首店.jpeg"),
    imageAlt: {
      zh: "拓竹科技首店内部展示空间",
      en: "Interior display space of the Bambu Lab first store"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 540 平方米",
        en: "Approx. 540 sqm"
      },
      {
        zh: "拓竹科技",
        en: "Bambu Lab"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/07 深圳 · 拓竹科技首店.jpeg"),
        alt: {
          zh: "首店内的产品演示区",
          en: "Product demonstration zone inside the first store"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/feature/05 2025·深圳 · 拓竹科技首店.jpeg"),
        alt: {
          zh: "拓竹科技首店的陈列与活动界面",
          en: "Retail display and event interface inside the Bambu Lab store"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "light-encounter-theater",
    code: "MST-021",
    year: "2024",
    location: {
      zh: "深圳，中国",
      en: "Shenzhen, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "文化 / 沉浸式剧场",
      en: "Culture / Immersive Theater"
    },
    title: {
      zh: "光遇剧场",
      en: "Light Encounter Theater"
    },
    dek: {
      zh: "以光、动线和观演距离重组商业空间中的沉浸式剧场体验。",
      en: "An immersive theater experience in a commercial setting, organized through light, circulation, and viewing distance."
    },
    body: {
      zh: [
        "项目在既有商业界面中植入一组连续的观演空间，让等待、聚集、进入与观看成为一段完整的空间叙事。",
        "光线被处理成引导路径的主要媒介：局部的暗度、反射与高亮共同建立观众对方向和场景的感知。",
        "界面材料保持轻和克制，重点放在人的移动、光的变化以及舞台事件之间的关系。"
      ],
      en: [
        "The project inserts a sequence of performance rooms into an existing commercial interface so waiting, gathering, entering, and watching become one spatial narrative.",
        "Light becomes the primary guide: local darkness, reflection, and highlights help visitors understand direction and scene.",
        "Material treatment stays light and restrained, keeping attention on movement, changing illumination, and the relation between audience and event."
      ]
    },
    image: featureAsset("home/horizontal/05 深圳 · 光遇剧场.jpeg"),
    heroImage: heroAsset("home/horizontal/05 深圳 · 光遇剧场.jpeg"),
    imageAlt: {
      zh: "光遇剧场的观演空间",
      en: "Performance space inside Light Encounter Theater"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 1,120 平方米",
        en: "Approx. 1,120 sqm"
      },
      {
        zh: "商业文化空间业主",
        en: "Commercial Cultural Space Client"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/05 深圳 · 光遇剧场.jpeg"),
        alt: {
          zh: "剧场中的光线与观演界面",
          en: "Light and audience interface inside the theater"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/vertical/05 深圳 · 光遇剧场.jpeg"),
        alt: {
          zh: "剧场入口与过渡空间",
          en: "Theater entry and threshold space"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "teastone-mixc",
    code: "MST-022",
    year: "2024",
    location: {
      zh: "杭州，中国",
      en: "Hangzhou, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "零售 / 茶饮空间",
      en: "Retail / Tea Space"
    },
    title: {
      zh: "万象城 tea’stone",
      en: "MixC tea’stone"
    },
    dek: {
      zh: "在高密度商业场景中建立一处低声量的茶饮、停留与展示空间。",
      en: "A quiet tea, display, and pause space set within a dense commercial environment."
    },
    body: {
      zh: [
        "项目把茶饮消费从快速通过的商业动线中抽离出来，以连续的台面、低饱和材料和明确的边界组织停留。",
        "空间的核心不是装饰性符号，而是操作、展示和坐席之间的节奏，让顾客能清晰感知制茶过程。",
        "材料细部控制在温和的反射和触感之内，使店铺在商场环境中保持安静但可识别的存在。"
      ],
      en: [
        "The project pulls tea consumption away from fast retail circulation, using continuous counters, desaturated materials, and precise edges to organize pause.",
        "The spatial focus is not decorative symbolism but the rhythm between preparation, display, and seating, making the tea-making process legible.",
        "Details stay within gentle reflection and tactility, giving the shop a quiet but recognizable presence inside the mall."
      ]
    },
    image: featureAsset("home/horizontal/06 杭州 · 万象城 tea’stone.jpeg"),
    heroImage: heroAsset("home/horizontal/06 杭州 · 万象城 tea’stone.jpeg"),
    imageAlt: {
      zh: "万象城 tea’stone 的室内空间",
      en: "Interior of MixC tea’stone"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 420 平方米",
        en: "Approx. 420 sqm"
      },
      {
        zh: "tea’stone",
        en: "tea’stone"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/06 杭州 · 万象城 tea’stone.jpeg"),
        alt: {
          zh: "茶饮空间的吧台与客席",
          en: "Counter and seating in the tea space"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/vertical/06 杭州 · 万象城 tea’stone.jpeg"),
        alt: {
          zh: "店铺界面与材料细部",
          en: "Shop interface and material detail"
        },
        credit: "MIST Architects Archive"
      }
    ]
  },
  {
    slug: "meditation-hall-by-the-wetland",
    code: "MST-020",
    year: "2023",
    location: {
      zh: "北京，中国",
      en: "Beijing, China"
    },
    status: {
      zh: "建成",
      en: "Completed"
    },
    typology: {
      zh: "文化 / 静修空间",
      en: "Culture / Meditation Space"
    },
    title: {
      zh: "湿地旁的禅修馆",
      en: "Meditation Hall by the Wetland"
    },
    dek: {
      zh: "面向湿地边缘的一处安静修习空间，以木、暗色界面和细窄光线组织身体尺度。",
      en: "A quiet practice hall beside the wetland, shaping bodily scale through timber, dark surfaces, and narrow light."
    },
    body: {
      zh: [
        "项目把外部湿地的开阔感转译为内部收束的行走体验，入口、廊道与主厅之间形成由暗到明的连续过渡。",
        "木质界面控制声音和触感，深色顶面压低视觉重心，让人的注意力回到步伐、呼吸和光线。",
        "建筑并不试图复制自然，而是在湿地边缘提供一段可被安静使用的边界。"
      ],
      en: [
        "The project translates the openness of the wetland into a compressed interior route, moving from entry to corridor to hall through a gradual shift from dark to light.",
        "Timber surfaces manage sound and tactility while the dark ceiling lowers visual weight, returning attention to pace, breath, and light.",
        "Rather than reproducing nature, the architecture offers a quiet usable boundary at the edge of the wetland."
      ]
    },
    image: featureAsset("home/horizontal/08 北京 · 湿地旁的禅修馆.jpeg"),
    heroImage: heroAsset("home/horizontal/08 北京 · 湿地旁的禅修馆.jpeg"),
    imageAlt: {
      zh: "湿地旁的禅修馆室内廊道",
      en: "Interior corridor of the Meditation Hall by the Wetland"
    },
    credit: "MIST Architects Archive",
    facts: projectFacts(
      {
        zh: "约 760 平方米",
        en: "Approx. 760 sqm"
      },
      {
        zh: "静修与文化空间业主",
        en: "Meditation and Cultural Space Client"
      }
    ),
    gallery: [
      {
        src: heroAsset("home/horizontal/08 北京 · 湿地旁的禅修馆.jpeg"),
        alt: {
          zh: "禅修馆的木质廊道与暗色顶面",
          en: "Timber corridor and dark ceiling inside the meditation hall"
        },
        credit: "MIST Architects Archive"
      },
      {
        src: featureAsset("home/vertical/08 北京 · 湿地旁的禅修馆.jpeg"),
        alt: {
          zh: "静修空间中的光线与材料",
          en: "Light and material inside the meditation space"
        },
        credit: "MIST Architects Archive"
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
