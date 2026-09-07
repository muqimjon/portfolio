export type Tab = 'home' | 'work' | 'contact';
export type Lang = 'uz' | 'en';
export type StatusKey = 'prod' | 'beta';
export type ProjectKey = 'cartex' | 'volt' | 'optivis' | 'kotib';

export interface Seo {
  title: string;
  description: string;
}

export interface Copy {
  seo: Record<Tab, Seo>;
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
    seo: {
      home: {
        title: "Muqimjon Mamadaliyev | .NET Backend Developer, Farg'ona",
        description:
          "Muqimjon Mamadaliyev — Farg'onalik .NET backend dasturchi: Clean Architecture, CQRS, PostgreSQL, Docker, Angular. Cartex, VoltStream, OptiVis va Kotib loyihalari.",
      },
      work: {
        title: 'Loyihalar — Muqimjon Mamadaliyev | .NET, Angular, Docker',
        description:
          "Cartex savdo ekotizimi, VoltStream ombor tizimi, OptiVis call-center analitikasi va Kotib Telegram boti — Muqimjon Mamadaliyev'ning .NET va Angular loyihalari.",
      },
      contact: {
        title: 'Aloqa — Muqimjon Mamadaliyev | .NET dasturchi bilan bog‘lanish',
        description:
          "Muqimjon Mamadaliyev bilan bog'laning: GitHub, LinkedIn, Telegram va e-mail. Backend masalasi yoki kuchli jamoa taklifi bo'lsa — yozing.",
      },
    },
    nav: ['Bosh', 'Loyihalar', 'Aloqa'],
    hi: 'salom, bu Muqimjon',
    role1: '.NET Backend',
    role2: 'dasturchi',
    intro:
      "Real mijozlar har kuni ishlatadigan tizimlar: Clean Architecture, CQRS, PostgreSQL, Docker. Kerak bo'lsa mahsulot veb, desktop va mobil interfeyslari bilan boshdan oxirigacha olib chiqiladi.",
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
        'Savdo biznesi uchun ekotizim: kompyuter va telefon ilovalari, veb orqali boshqaruv va hisobot. Eng yirik jamoaviy loyihamiz.',
      volt: 'Kabel zavodi uchun ombor va savdo boshqaruvi. Rahbariyatda kompyuter ilovasi, sexda veb. Zavod serverida, kunlik zaxira bilan.',
      optivis:
        "Hamroh mikromoliya tashkiloti uchun call-center analitikasi. Qo'ng'iroqlar jonli kuzatiladi, yuk va samaradorlik hisobotda.",
      kotib:
        "Telegram Business uchun AI-kotib: egasi band bo'lganda mijozga javob beradi, navbatga yozadi, zararli APK'larni to'sadi.",
    },
  },
  en: {
    seo: {
      home: {
        title: 'Muqimjon Mamadaliyev | .NET Backend Developer, Fergana, Uzbekistan',
        description:
          '.NET backend developer from Fergana, Uzbekistan: Clean Architecture, CQRS, PostgreSQL, Docker, Angular. Projects: Cartex, VoltStream, OptiVis and Kotib.',
      },
      work: {
        title: 'Projects — Muqimjon Mamadaliyev | .NET, Angular, Docker',
        description:
          'Cartex retail ecosystem, VoltStream inventory system, OptiVis call-center analytics and the Kotib Telegram bot — .NET and Angular projects by Muqimjon Mamadaliyev.',
      },
      contact: {
        title: 'Contact — Muqimjon Mamadaliyev | Hire a .NET backend developer',
        description:
          'Get in touch with Muqimjon Mamadaliyev: GitHub, LinkedIn, Telegram and e-mail. Interesting backend problem or a strong team? Write me.',
      },
    },
    nav: ['Home', 'Work', 'Contact'],
    hi: 'hi, I’m Muqimjon',
    role1: '.NET Backend',
    role2: 'Developer',
    intro:
      'Systems real clients use every day: Clean Architecture, CQRS, PostgreSQL, Docker. When it is needed, the product ships end to end, with its web, desktop and mobile interfaces.',
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
        'An ecosystem for a retail business: apps on computer and phone, management and reporting on the web. Our largest team project.',
      volt: "A desktop app for management, the web on the shop floor: inventory and sales for a cable factory, on the factory's own server.",
      optivis:
        'Call-centre analytics for Hamroh Microfinance. Calls are followed live, with load and performance in the reports.',
      kotib:
        'An AI assistant for Telegram Business: it answers customers while the owner is busy, books the queue and blocks malicious APKs.',
    },
  },
};

export const PROJECTS: Project[] = [
  {
    key: 'cartex',
    name: 'Cartex',
    st: 'prod',
    stack: ['.NET 10', 'Angular 22', 'Avalonia', 'MAUI', 'Docker'],
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
