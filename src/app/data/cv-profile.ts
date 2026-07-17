export type SupportedLanguage = 'en' | 'da';

export type LocalizedText = {
  en: string;
  da: string;
};

export type DateRange = string | string[];

export interface CvSoftSkill {
  name: LocalizedText;
  level: number;
  text: LocalizedText;
}

export interface CvWorkExperienceItem {
  date: DateRange;
  company: string;
  description: LocalizedText;
}

export interface CvOtherExperienceItem {
  date: DateRange;
  name: string;
  description: LocalizedText;
}

export interface CvEducationItem {
  date: DateRange;
  name: LocalizedText;
  description: LocalizedText;
  legacyDetails?: string;
}

export interface CvRoleContent {
  title: string;
  quote: LocalizedText;
  info: LocalizedText;
  skillInfo: LocalizedText;
}

export interface CvExperienceEmphasis {
  highlightKeywords: string[];
  descriptionFocus: 'technical' | 'support' | 'balanced';
}

export interface CvProfile {
  id: number;
  name: string;
  lastName: string;
  title: {
    en: string;
  };
  title2: {
    en: string;
  };
  phone: string;
  email: string;
  license: string;
  webpage: string;
  linkedin: string;
  github: string;
  quote: LocalizedText;
  info: LocalizedText;
  skillInfo: LocalizedText;
  softSkills: CvSoftSkill[];
  workExperience: CvWorkExperienceItem[];
  education: CvEducationItem[];
  otherExperience: CvOtherExperienceItem[];
  spareTime: LocalizedText;
  spokenLanguages: LocalizedText[];
}

export type CvRole = 'developer' | 'it-support' | 'general';

export const cvProfile: CvProfile = {
  id: 0,
  name: 'Niclas',
  lastName: 'Juul Schæffer',
  title: { en: 'IT Specialist – Development & Support' },
  title2: { en: 'Pragmatic, people-focused problem solver' },
  phone: '+45 22 20 78 12',
  email: 'Niclasschaeffer96@gmail.com',
  license: 'AM, B',
  webpage: 'https://niclasjuul.dk',
  linkedin: 'https://www.linkedin.com/in/niclas-juul-schaeffer/',
  github: 'https://github.com/Niclasjuul96',
  quote: {
    en: 'Service-minded IT supporter who takes ownership, solves issues thoroughly and makes technology feel simple.',
    da: 'Serviceminded IT-supporter, der tager ansvar, løser problemer grundigt og gør teknologi enkel for brugeren.'
  },
  info: {
    en:
      'IT supporter with experience in both 1st and 2nd level support and technical problem-solving. ' +
      'I work structured and take ownership of cases from first contact to final resolution. ' +
      'With a background in both IT and customer-facing roles, I am used to explaining technical issues ' +
      'in a clear and calm way, even when things are busy. My technical foundation in systems and development ' +
      'gives me a strong understanding of how solutions are built, but my focus is always on creating a smooth ' +
      'and reliable experience for the end user.',
    da:
      'IT-supporter med erfaring inden for både 1st og 2nd level support og teknisk fejlfinding. ' +
      'Jeg arbejder struktureret og tager ansvar for mine sager fra første henvendelse til endelig løsning. ' +
      'Med baggrund i både IT og kundevendte roller er jeg vant til at forklare tekniske problemstillinger ' +
      'klart og roligt, også når der er travlt. Min tekniske forståelse giver mig et solidt fundament, ' +
      'men mit fokus er altid at skabe en stabil og tryg oplevelse for brugeren.'
  },
  skillInfo: {
    en:
      'As you explore my profile, you\'ll see a broad IT skill set that combines software development, support and operations. ' +
      'I build scalable backend solutions with ASP.NET, C# and SQL Server and create intuitive frontend interfaces with React, ' +
      'JavaScript, HTML and CSS. I also work with WordPress, custom themes and extensions, and use XML and XSLT for data ' +
      'transformation and system integration. From debugging incidents and supporting end users to implementing new features, ' +
      'I focus on maintainable, efficient solutions that solve real business and day-to-day challenges.',
    da:
      'Når du udforsker min profil, vil du se et bredt IT-kompetencesæt, der kombinerer softwareudvikling, support og drift. ' +
      'Jeg bygger skalerbare backend-løsninger med ASP.NET, C# og SQL Server og skaber intuitive frontend-grænseflader med ' +
      'React, JavaScript, HTML og CSS. Jeg arbejder også med WordPress, skræddersyede temaer og udvidelser samt XML og XSLT ' +
      'til datatransformation og systemintegration. Fra fejlsøgning og bruger-support til implementering af nye funktioner ' +
      'har jeg fokus på vedligeholdelige, effektive løsninger, der løser både forretningsmæssige og dagligdags behov.'
  },
  softSkills: [
    {
      name: { en: 'People-centred coordination (ESFJ-T)', da: 'Menneskecentreret koordinering (ESFJ-T)' },
      level: 5,
      text: {
        en: 'Warm, inclusive facilitation that builds trust and momentum. Everyone is heard, morale is protected, and collaboration stays smooth.',
        da: 'Varm, inkluderende facilitering, der skaber tillid og fremdrift. Alle bliver hørt, trivslen prioriteres, og samarbejdet forbliver smidigt.'
      }
    },
    {
      name: { en: 'Stakeholder communication & empathy', da: 'Interessentkommunikation & empati' },
      level: 5,
      text: {
        en: 'Needs are translated into clear, actionable requirements; expectations are aligned early; the user perspective is kept front and centre.',
        da: 'Behov oversættes til klare, handlingsorienterede krav; forventninger afstemmes tidligt; brugerperspektivet holdes i fokus.'
      }
    },
    {
      name: { en: 'Structure & follow-through', da: 'Struktur & opfølgning' },
      level: 5,
      text: {
        en: 'Plans, priorities, and checklists keep delivery on time. Loose ends are closed and ceremonies run predictably.',
        da: 'Planer, prioriteringer og tjeklister sikrer rettidig levering. Løse ender lukkes, og ceremonier kører forudsigeligt.'
      }
    },
    {
      name: { en: 'Quality & consistency', da: 'Kvalitet & konsistens' },
      level: 4,
      text: {
        en: 'Clear standards, naming, documentation, and acceptance criteria. Pragmatic quality that supports maintainability.',
        da: 'Tydelige standarder, navngivning, dokumentation og acceptkriterier. Pragmatisk kvalitet, der understøtter vedligeholdelse.'
      }
    },
    {
      name: { en: 'Feedback-driven growth', da: 'Feedback-drevet udvikling' },
      level: 4,
      text: {
        en: 'Feedback is actively sought and turned into concrete improvements. Sensitive to signals yet resilient and adaptive.',
        da: 'Feedback opsøges aktivt og omsættes til konkrete forbedringer. Følsom for signaler, men robust og omstillingsparat.'
      }
    },
    {
      name: { en: 'Team dynamics (ESFJ-T)', da: 'Teamdynamik (ESFJ-T)' },
      level: 5,
      text: {
        en: 'Pairs well with analysts by humanising data; with ideators by turning ideas into clear plans; with drivers by aligning people and process. Creates psychological safety and sustained pace.',
        da: 'Matcher godt med analytikere (præcision) ved at humanisere data; med idéskabere (vision) ved at omsætte idéer til klare planer; med drivere (tempo) ved at skabe alignment mellem mennesker og proces. Skaber psykologisk tryghed og vedvarende tempo.'
      }
    }
  ],
  workExperience: [
    {
      date: 'May. 2026 - Present',
      company: 'Customer Support Specialist - CCC Nordic',
      description: {
        en:
          'At CCC Nordic, I support customers by solving a wide range of issues with a calm, structured and solution-focused approach. ' +
          'I work through complex problems, communicate clearly with customers, and make sure each case is followed through to a solid resolution. ' +
          'The role has strengthened my communication skills, my ability to stay composed under pressure, and my proactive mindset in delivering strong customer support.',
        da:
          'Hos CCC Nordic støtter jeg kunder ved at løse en bred vifte af problemer med en rolig, struktureret og løsningsorienteret tilgang. ' +
          'Jeg arbejder mig igennem komplekse udfordringer, kommunikerer tydeligt med kunder og sikrer, at hver sag følges gennem til en solid løsning. ' +
          'Rollen har styrket mine kommunikationsfærdigheder, min evne til at forblive rolig under pres og min proaktive tilgang til at levere stærk kundesupport.'
      }
    },
    {
      date: 'Mar. 2025 - December 2025',
      company: 'Developer - ITAGIL',
      description: {
        en:
          'At ITAGIL, tailored software solutions are developed for clients. The company\'s CMS is enhanced,' +
          ' and client websites are built and maintained to meet specific requirements. New features are delivered,' +
          ' existing systems are maintained and optimized, and issues are diagnosed and resolved to ensure reliability.' +
          ' Projects are delivered efficiently and to a high standard through close team collaboration.',
        da:
          'Hos ITAGIL udvikles skræddersyede softwareløsninger til kunder. Virksomhedens CMS videreudvikles,' +
          ' og kunders hjemmesider bygges og vedligeholdes efter deres behov. Nye funktioner leveres, eksisterende' +
          ' systemer vedligeholdes og optimeres, og problemer diagnosticeres og løses for at sikre stabil drift. ' +
          'Projekter leveres effektivt og i høj kvalitet gennem tæt samarbejde i teamet.'
      }
    },
    {
      date: 'Jun. 2022 - Aug. 2023',
      company: 'Webshop Assistant - Alex Cykler (Part time)',
      description: {
        en:
          'At Alex Cykler, the e-commerce webshop was established and maintained. Product listings were created' +
          ' and kept up to date to ensure accurate information across the platform. Warehouse operations were supported,' +
          ' including packing and shipping customer orders.',
        da:
          'Hos Alex Cykler blev e-commerce-webshoppen etableret og vedligeholdt. Produktlister blev oprettet og ' +
          'løbende opdateret for at sikre korrekte oplysninger på platformen. Lageropgaver blev understøttet, herunder ' +
          'pakning og forsendelse af kundeordrer.'
      }
    },
    {
      date: 'Aug. 2016 - May. 2022',
      company: 'IT Support Specialist - Technical Education Copenhagen',
      description: {
        en:
          'First- and second-level support was provided, with hardware and software issues diagnosed and resolved and ' +
          'technical assistance delivered to users. System maintenance and optimization were carried out, while experience ' +
          'was gained in web development and IT service management.',
        da:
          '1. og 2. level support blev ydet, hvor hardware- og softwareproblemer blev diagnosticeret og løst, og ' +
          'teknisk assistance blev leveret til brugere. Systemvedligeholdelse og optimering blev udført, og der blev ' +
          'opnået erfaring med webudvikling og IT-service management.'
      }
    }
  ],
  education: [
    {
      date: 'Jun. 2022 - Feb. 2025',
      name: {
        en: 'Software engineering at DTU',
        da: 'Software Engineering på DTU'
      },
      description: {
        en:
          'At DTU, a solid foundation in software engineering was established. Coursework included algorithms and data structures,' +
          ' computer systems, distributed applications, UX design and prototyping, and software engineering methodologies. ' +
          'Project management skills were developed, and practical programming assignments connected theory with application.',
        da:
          'På DTU blev der opbygget et solidt fundament i software engineering. Forløbet omfattede algoritmer og datastrukturer,' +
          ' computersystemer, distribuerede applikationer, UX-design og prototypeudvikling samt software engineering-metoder. ' +
          'Projektledelseskompetencer blev udviklet, og praktiske programmeringsopgaver bandt teori sammen med anvendelse.'
      },
      legacyDetails:
        'Operating Systems, Algorithms and Data Structures, Computer Systems, Introduction to Coordination of Distributed Applications, UX Design and Prototype Development, Software Engineering, Project Management, Physics 1, Introductory Programming'
    },
    {
      date: 'Jan. 2016 - Jun. 2021',
      name: {
        en: 'Datatechnitian specialized in Programming - EUX TEC Ballerup',
        da: 'Datatekniker med speciale i programmering - EUX TEC Ballerup'
      },
      description: {
        en:
          'At EUX TEC Ballerup, a specialization as a datatechnician in programming was completed. ' +
          'Broad exposure was gained across IT disciplines, including Java and C# programming, database systems, ' +
          'Linux and Windows server technologies, virtualization, embedded systems, and mobile application development. ' +
          'Emphasis was also placed on IT service management, networking, and system development through project-oriented work.',
        da:
          'På EUX TEC Ballerup blev en specialisering som datatekniker med fokus på programmering gennemført. ' +
          'Der blev opnået bred indsigt i IT-discipliner, herunder programmering i Java og C#, databasesystemer, ' +
          'Linux- og Windows-serverteknologier, virtualisering, indlejrede systemer og udvikling af mobile applikationer. ' +
          'Der blev også lagt vægt på IT-service management, netværk og systemudvikling gennem projektorienteret arbejde.'
      },
      legacyDetails:
        'Information Technology, Technical Subjects, Advanced Operating Systems, Backup Technology, Computer Technology, Server Technology, Programming (Java), Programming (C#), Database Systems, IT Requirement Specification, System Development and Project Management, Virtualization, Embedded Controller, Programming of Mobile Applications, IT Service Management, Network Technology, Web Server Technology'
    }
  ],
  otherExperience: [
    {
      date: 'Jan. 2026 - Feb. 2026',
      name: 'Thansen',
      description: {
        en:
          'In the role at Thansen, customer service and sales activities were handled, including selling automotive parts and accessories and assisting customers with their requests. Communication skills were strengthened and a service-minded approach was reinforced.',
        da:
          'I rollen hos Thansen blev kundeservice- og salgsaktiviteter håndteret, herunder salg af bildel og tilbehør samt hjælp til kunders forespørgsler. Kommunikationsevner blev styrket, og en serviceorienteret tilgang blev understøttet.'
      }
    },
    {
      date: ['Dec. 2019 - Mar. 2025', 'Dec. 2025 - Dec. 2025'],
      name: 'Bog og Ide',
      description: {
        en:
          'Sales and customer service activities were handled, including selling books, board games, and toys ' +
          'and assisting customers with their requests. Communication skills were strengthened and a service-minded ' +
          'approach was reinforced.',
        da:
          'Salg og kundeservice blev håndteret, herunder salg af bøger, brætspil og legetøj samt hjælp til ' +
          'kunders forespørgsler. Kommunikationsevner blev styrket, og en serviceorienteret tilgang blev understøttet.'
      }
    },
    {
      date: 'Apr. 2017 - Jun. 2021',
      name: 'Beredskabets venner',
      description: {
        en:
          'Tasks related to customer service, communications, and situation handling were supported, fostering a ' +
          'calm and solution-oriented approach to unexpected challenges.',
        da:
          'Opgaver inden for kundeservice, kommunikation og situationshåndtering blev understøttet, ' +
          'hvilket styrkede en rolig og løsningsorienteret tilgang til uventede udfordringer.'
      }
    }
  ],
  spareTime: {
    en:
      'I spend most of my spare time with my family, including my two kids, ' +
      'enjoying quality moments together. Additionally, I prioritize staying active by ' +
      'running and going to the gym, which helps me maintain both physical and mental well-being.',
    da:
      'Jeg bruger det meste af min fritid sammen med min familie, herunder mine to børn, ' +
      'hvor vi nyder kvalitetstid sammen. Derudover prioriterer jeg at holde mig aktiv ved at løbe ' +
      'og gå i fitness, hvilket hjælper mig med at opretholde både fysisk og mental velvære.'
  },
  spokenLanguages: [
    { en: 'Danish - Native', da: 'Dansk - Modersmål' },
    { en: 'English - Fluent', da: 'Engelsk - Flydende' }
  ]
};

export const roleContentByRole: Record<CvRole, CvRoleContent> = {
  developer: {
    title: 'Full Stack Developer',
    quote: {
      en: 'Passionate developer building scalable web solutions with modern technology. Frontend-focused with strong backend fundamentals.',
      da: 'Dedikeret udvikler der bygger skalerbare web-løsninger med moderne teknologi. Frontend-fokuseret med stærk backend-viden.'
    },
    info: {
      en:
        'Full stack developer with expertise in building responsive web applications using React, JavaScript, HTML, and CSS. ' +
        'I design and implement scalable backend solutions using ASP.NET and C# with SQL Server databases. ' +
        'Experienced with WordPress customization and XML/XSLT for data transformation. ' +
        'I focus on clean, maintainable code that delivers real value, from architectural decisions to final deployment.',
      da:
        'Full stack-udvikler med ekspertise i at bygge responsive web-applikationer med React, JavaScript, HTML og CSS. ' +
        'Jeg designer og implementerer skalerbare backend-løsninger med ASP.NET og C# med SQL Server-databaser. ' +
        'Erfaring med WordPress-tilpasning og XML/XSLT til datatransformation. ' +
        'Jeg fokuserer på ren, vedligeholdelig kode, der leverer reel værdi fra arkitektur til deployment.'
    },
    skillInfo: {
      en:
        'My development stack includes React for dynamic frontend interfaces, C# and ASP.NET for robust backend services, ' +
        'and SQL Server for data management. I\'m comfortable with full development lifecycle including design, implementation, ' +
        'testing, and deployment. I value clean code, performance optimization, and creating intuitive user experiences.',
      da:
        'Mit udviklings-stakk includes React til dynamiske frontend-grænseflader, C# og ASP.NET til robuste backend-services, ' +
        'og SQL Server til datastyring. Jeg er fortrolig med hele udviklingscyklus inklusive design, implementering, ' +
        'test og deployment. Jeg værdisætter ren kode, performance-optimering og intuitive brugeroplevelser.'
    }
  },
  'it-support': {
    title: 'IT Support Specialist',
    quote: {
      en: 'Service-minded IT supporter who takes ownership, solves issues thoroughly and makes technology feel simple.',
      da: 'Serviceminded IT-supporter, der tager ansvar, løser problemer grundigt og gør teknologi enkel for brugeren.'
    },
    info: {
      en:
        'IT supporter with experience in both 1st and 2nd level support and technical problem-solving. ' +
        'I work structured and take ownership of cases from first contact to final resolution. ' +
        'With a background in both IT and customer-facing roles, I am used to explaining technical issues ' +
        'in a clear and calm way, even when things are busy. My technical foundation in systems and development ' +
        'gives me a strong understanding of how solutions are built, but my focus is always on creating a smooth ' +
        'and reliable experience for the end user.',
      da:
        'IT-supporter med erfaring inden for både 1st og 2nd level support og teknisk fejlfinding. ' +
        'Jeg arbejder struktureret og tager ansvar for mine sager fra første henvendelse til endelig løsning. ' +
        'Med baggrund i både IT og kundevendte roller er jeg vant til at forklare tekniske problemstillinger ' +
        'klart og roligt, også når der er travlt. Min tekniske forståelse giver mig et solidt fundament, ' +
        'men mit fokus er altid at skabe en stabil og tryg oplevelse for brugeren.'
    },
    skillInfo: {
      en:
        'I combine technical support expertise with problem-solving abilities. My experience spans system troubleshooting, ' +
        'user support, and technical documentation. I\'m skilled at diagnosing issues quickly, communicating solutions clearly, ' +
        'and maintaining systems to prevent problems. My development background helps me understand technical challenges deeply ' +
        'and provide reliable, long-term solutions.',
      da:
        'Jeg kombinerer teknisk support-ekspertise med problemløsningsevner. Min erfaring omfatter system-fejlfinding, ' +
        'bruger-support og teknisk dokumentation. Jeg kan diagnosticere problemer hurtigt, kommunikere løsninger klart ' +
        'og vedligeholde systemer for at forhindre problemer. Min udviklings-baggrund hjælper mig med at forstå tekniske ' +
        'udfordringer grundigt og give pålidelige, langsigtede løsninger.'
    }
  },
  general: {
    title: 'Professional Profile',
    quote: {
      en: 'Versatile professional with a diverse skill set, combining technical expertise with strong problem-solving and communication abilities.',
      da: 'Alsidig professionel med et bredt kompetencesæt, der kombinerer teknisk ekspertise med stærke problemløsnings- og kommunikationsevner.'
    },
    info: {
      en:
        'Professional with a comprehensive background spanning IT support, software development, and diverse project work. ' +
        'I bring technical depth combined with a service-minded approach to solving challenges. ' +
        'Experienced in both technical implementation and user-focused problem solving, I excel at bridging the gap between complex technical concepts ' +
        'and practical business needs. My background enables me to work effectively across different roles and industries.',
      da:
        'Professionel med en omfattende baggrund inden for IT support, softwareudvikling og varieret projektarbejde. ' +
        'Jeg bringer teknisk dybde kombineret med en serviceminded tilgang til problemløsning. ' +
        'Erfaring med både teknisk implementering og brugerfokuseret problemløsning gør mig i stand til at bygge bro mellem komplekse tekniske koncepter ' +
        'og praktiske forretningsbehov. Min baggrund gør mig i stand til at arbejde effektivt på tværs af forskellige roller og brancher.'
    },
    skillInfo: {
      en:
        'My professional toolkit includes both technical development skills (frontend, backend, databases) and support expertise (troubleshooting, user support, systems administration). ' +
        'I combine these with strong soft skills: clear communication, structured problem-solving, and the ability to adapt to different environments. ' +
        'Whether building solutions, supporting users, or coordinating across teams, I bring the same commitment to quality and continuous improvement.',
      da:
        'Mit professionelle værktøj omfatter både tekniske udviklingsfærdigheder (frontend, backend, databaser) og support-ekspertise (fejlfinding, bruger-support, systemadministration). ' +
        'Jeg kombinerer disse med stærke personlige kompetencer: klar kommunikation, struktureret problemløsning og evnen til at tilpasse mig forskellige miljøer. ' +
        'Uanset om jeg bygger løsninger, supporter brugere eller koordinerer på tværs af teams, bringer jeg samme dedikation til kvalitet og kontinuerlig forbedring.'
    }
  }
};

export const experienceEmphasisByRole: Record<CvRole, CvExperienceEmphasis> = {
  developer: {
    highlightKeywords: ['development', 'built', 'designed', 'implemented', 'frontend', 'backend', 'API', 'react', 'database'],
    descriptionFocus: 'technical'
  },
  'it-support': {
    highlightKeywords: ['support', 'resolved', 'troubleshot', 'maintained', 'user support', 'systems', 'documented', 'trained'],
    descriptionFocus: 'support'
  },
  general: {
    highlightKeywords: ['developed', 'supported', 'managed', 'implemented', 'solved', 'coordinated', 'optimized', 'improved'],
    descriptionFocus: 'balanced'
  }
};

export interface SiteService {
  id: number;
  name: string;
  img: string;
  description: string;
  link: string;
}

export interface SiteProject {
  id: number;
  title: string;
  imgURL: string;
  detail: string;
  githuburl: string;
  livepreviewurl?: string;
  tech: string[];
  accounts?: string[];
}

export interface SiteTechnology {
  name: string;
  icon: string;
}

export const siteServices: SiteService[] = [
  {
    id: 1,
    name: 'Web Development',
    img: 'assets/webdevelopment.png',
    description: 'I like to code things from scratch, and enjoy bringing ideas to life in the browser.',
    link: '/about'
  },
  {
    id: 2,
    name: 'UI/UX Design',
    img: 'assets/UIUXDesign.png',
    description: 'I value simple content structure, clean design patterns, and thoughtful interactions.',
    link: '/about'
  },
  {
    id: 3,
    name: 'FreeLancing',
    img: 'assets/Freelancing.jpg',
    description: 'I want to set my self free and work on multiple projects and bringing my ideas to life.',
    link: '/about'
  }
];

export const siteProjects: SiteProject[] = [
  {
    id: 1,
    title: 'Chat-App',
    imgURL: 'assets/project-images/Chat-App.png',
    detail: 'This chat application is based on react and using firebase as the backend to track messages back and forth between users. It is available to use the existing accounts or creating a new account. It will be possible to find the users by thier firstName, upper and lowercase dosn\'t matter. for the real experience i would recommend to create an account and searching for users. cause many of the test users already have conversations between them.',
    githuburl: 'https://github.com/Niclasjuul96/Chat-App',
    livepreviewurl: 'http://chatapp.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json', 'firebase'],
    accounts: [
      'Account 1: jimmy@gmail.com, pass: password',
      'Account 2: jenna@gmail.com, pass: password',
      'Account 3: jennifer@gmail.com, pass: password',
      'Account 4: peter@gmail.com pass: password'
    ]
  },
  {
    id: 2,
    title: 'NoteEase',
    imgURL: 'assets/project-images/NoteEase.png',
    detail: 'NoteEase was one of my first projects, that i was doing while learning react. a simple note taking app that is saving your notes to remember for another time, i am using json and local storage to retrieve and save notes and able to delete aswell',
    githuburl: 'https://github.com/Niclasjuul96/NoteEase',
    livepreviewurl: 'http://noteease.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json']
  },
  {
    id: 3,
    title: 'Simon Says Game',
    imgURL: 'assets/project-images/SimonGame.png',
    detail: 'Simon game was a little funny project that i was testing if i would be able to do. it\'s just envolving the basic html, css and javascript.',
    githuburl: 'https://github.com/Niclasjuul96/SimonGame',
    livepreviewurl: 'http://simongame.niclasjuul.dk/',
    tech: ['Html', 'CSS', 'JavaScript']
  },
  {
    id: 4,
    title: 'Password Generator',
    imgURL: 'assets/project-images/password.png',
    detail: 'Password generator is a small and simple tool to generate password that includes what ever you like. to solve solve one of the hardest stuff in life, finding a password to use. and ofc the copy to clipboard doesn\'t work on the website cause it\'s not possible. but iif you download the project from github, you will be able to use that feature aswell.',
    githuburl: 'https://github.com/Niclasjuul96/PasswordGenerator/tree/main',
    livepreviewurl: 'http://passwordgenerator.niclasjuul.dk/',
    tech: ['html', 'CSS', 'JavaScript']
  },
  {
    id: 5,
    title: 'KanBan Board',
    imgURL: 'assets/project-images/KanBan.png',
    detail: 'This small kanban board project is based on console application, and coordination through tublespaces. Able to work around with the application at the same time without interfering with others. The live-preview will not work, so if you wanna look how it works, you will need to go to github and clone it.',
    githuburl: 'https://github.com/Niclasjuul96/KanBan',
    livepreviewurl: '',
    tech: ['Java', 'Tublespaces']
  }
];

export const siteTechstack: SiteTechnology[] = [
  { name: 'JavaScript', icon: 'assets/langLogo/javascript.svg' },
  { name: 'React', icon: 'assets/langLogo/react.svg' },
  { name: 'Node.js', icon: 'assets/langLogo/node-js.svg' },
  { name: 'HTML', icon: 'assets/langLogo/html.svg' },
  { name: 'CSS', icon: 'assets/langLogo/css.svg' },
  { name: 'MongoDB', icon: 'assets/langLogo/mongodb.svg' },
  { name: 'Java', icon: 'assets/langLogo/java.svg' },
  { name: 'Python', icon: 'assets/langLogo/python.svg' },
  { name: 'Typescript', icon: 'assets/langLogo/typescript.svg' },
  { name: 'C#', icon: 'assets/langLogo/csharp.svg' }
];
