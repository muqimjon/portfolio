export type Tab = 'home' | 'work' | 'contact';
export type Lang = 'uz' | 'en';
export type StatusKey = 'prod' | 'beta';
export type ProjectKey = 'cartex' | 'volt' | 'optivis' | 'kotib';

export interface Copy {
  nav: [string, string, string];
  hi: string;
  role1: string;
  role2: string;
  intro: string;
  ctaWork: string;
  ctaResume: string;
  contactTitle: string;
  contactLine: string;
  copy: string;
  email: string;
  status: string;
  st: Record<StatusKey, string>;
  pd: Record<ProjectKey, string>;
}

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  key: ProjectKey;
  name: string;
  st: StatusKey;
  stack: string[];
  links: Link[];
}

export interface Social {
  glyph: string;
  title: string;
  href: string;
}

export const RESUME = 'https://flowcv.com/resume/w7m1qvie37';

export const T: Record<Lang, Copy> = {
  uz: {
    nav: ['Bosh', 'Loyihalar', 'Aloqa'],
    hi: 'salom, men Muqimjon',
    role1: '.NET Backend',
    role2: 'Developer',
    intro:
      "Real mijozlar uchun ishlab chiqarishga chiqadigan tizimlar quraman — Clean Architecture, CQRS, PostgreSQL, Docker. Kerak bo'lsa Angular yoki WPF/Avalonia bilan mahsulotni to'liq yopaman.",
    ctaWork: "Loyihalarni ko'rish",
    ctaResume: 'Resume',
    contactTitle: 'Gaplashamizmi?',
    contactLine:
      "Hozir Cartex'ni rivojlantiryapman. Qiziq backend masalasi yoki kuchli jamoa bo'lsa — yozing, muhokama qilamiz.",
    copy: 'e-mail nusxalandi',
    email: 'gmail@muqimjon.uz',
    status: "Farg'ona · UTC+5 · hozir: Cartex",
    st: { prod: 'Production', beta: 'Beta' },
    pd: {
      cartex:
        "Savdo ekotizimi: Web API, Angular veb, Avalonia desktop va MAUI mobil klientlar. Eng yirik jamoaviy loyihamiz — Hetzner'da Docker bilan.",
      volt: "Kabel zavodi uchun ombor va savdo boshqaruvi. WPF desktop + Angular veb, on-site Docker, shifrlangan kunlik backup'lar.",
      optivis:
        'Hamroh mikromoliya tashkiloti uchun call-center analitikasi. Issabel/Asterisk telefoniya bilan jonli integratsiya.',
      kotib:
        "Shaxsiy loyiha. Angular frontend, Cloudflare'ga GitHub Actions orqali avtomatik deploy, Telegram bot.",
    },
  },
  en: {
    nav: ['Home', 'Work', 'Contact'],
    hi: 'hi, I’m Muqimjon',
    role1: '.NET Backend',
    role2: 'Developer',
    intro:
      'I build production systems for real clients — Clean Architecture, CQRS, PostgreSQL, Docker. When needed I close the loop with Angular or WPF/Avalonia.',
    ctaWork: 'See the work',
    ctaResume: 'Resume',
    contactTitle: 'Let’s talk.',
    contactLine:
      'Currently evolving Cartex. If you have an interesting backend problem or a strong team — write me, let’s discuss.',
    copy: 'e-mail copied',
    email: 'gmail@muqimjon.uz',
    status: 'Fergana · UTC+5 · now: Cartex',
    st: { prod: 'Production', beta: 'Beta' },
    pd: {
      cartex:
        'Retail ecosystem: Web API, Angular web, Avalonia desktop and MAUI mobile clients. Our largest team project — Docker on Hetzner.',
      volt: 'Inventory & sales system for a cable factory. WPF desktop + Angular web, on-site Docker, encrypted daily backups.',
      optivis:
        'Call-center analytics for Hamroh Microfinance. Live integration with Issabel/Asterisk telephony.',
      kotib:
        'Solo project. Angular frontend, auto-deployed to Cloudflare via GitHub Actions, Telegram bot.',
    },
  },
};

export const PROJECTS: Project[] = [
  {
    key: 'cartex',
    name: 'Cartex',
    st: 'prod',
    stack: ['.NET 10', 'Angular 22', 'Avalonia', 'MAUI', 'Docker', 'Hetzner'],
    links: [
      { label: 'Live', href: 'https://cartex.muqimjon.uz' },
      { label: 'GitHub', href: 'https://github.com/ovozadasturlar/cartex' },
    ],
  },
  {
    key: 'volt',
    name: 'VoltStream',
    st: 'prod',
    stack: ['.NET 10', 'WPF', 'Angular 22', 'PostgreSQL', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/muqimjon/volt-stream' }],
  },
  {
    key: 'optivis',
    name: 'OptiVis',
    st: 'prod',
    stack: ['.NET', 'Avalonia', 'MariaDB', 'Docker', 'Asterisk'],
    links: [{ label: 'GitHub', href: 'https://github.com/muqimjon/optivis' }],
  },
  {
    key: 'kotib',
    name: 'Kotib',
    st: 'beta',
    stack: ['Angular 22', 'Cloudflare', 'GitHub Actions', 'Telegram Bot'],
    links: [{ label: 'Live', href: 'https://kotib.muqimjon.uz' }],
  },
];

export const SOCIALS: Social[] = [
  { glyph: 'gh', title: 'GitHub', href: 'https://github.com/muqimjon' },
  { glyph: 'in', title: 'LinkedIn', href: 'https://www.linkedin.com/in/muqimjon/' },
  { glyph: 'tg', title: 'Telegram', href: 'https://t.me/muqimjon' },
];
