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
  title: { en: 'IT Support Specialist | Service Desk | 1st & 2nd Line' },
  title2: { en: 'Calm, service-minded and structured under pressure' },
  phone: '+45 22 20 78 12',
  email: 'Niclasschaeffer96@gmail.com',
  license: 'AM, B',
  webpage: 'https://niclasjuul.dk',
  linkedin: 'https://www.linkedin.com/in/niclas-juul-schaeffer/',
  github: 'https://github.com/Niclasjuul96',
  softSkills: [
    {
      name: { en: 'User-centric service & empathy', da: 'Brugercentreret service & empati' },
      level: 5,
      text: {
        en: 'I meet users with patience and high empathy. Technical needs are translated into simple instructions, and expectations are aligned early in the call.',
        da: 'Møder brugere med stor tålmodighed og empati. Tekniske behov oversættes til letforståelige instruktioner, og forventninger afstemmes tidligt i opkaldet.'
      }
    },
    {
      name: { en: 'Calmness under pressure', da: 'Ro under pres (ESFJ-T)' },
      level: 5,
      text: {
        en: 'Thrives in high-volume environments and 24/7 shifts. I maintain structure, prioritize effectively, and create psychological safety for both users and the team.',
        da: 'Trives i et miljø med højt tempo og skiftende arbejdstider. Bevarer strukturen, prioriterer skarpt og skaber ro for både brugeren og teamet.'
      }
    },
    {
      name: { en: 'Structure & ticket ownership', da: 'Struktur & sagsansvar' },
      level: 5,
      text: {
        en: 'Methodical approach to incident handling. I follow tickets all the way through, close loose ends, and ensure high documentation quality in the ITSM tool.',
        da: 'Metodisk tilgang til incidenthåndtering. Følger sager helt til dørs, lukker løse ender og sikrer høj dokumentationskvalitet i ITSM-systemet.'
      }
    },
    {
      name: { en: 'Knowledge sharing & ITIL culture', da: 'Vidensdeling & ITIL-kultur' },
      level: 4,
      text: {
        en: 'Contributes actively to standardizing solutions, updating knowledge base articles, and ensuring consistent service quality across shifts.',
        da: 'Bidrager aktivt til standardisering af løsninger, opdatering af KB-artikler og sikring af en ensartet servicekvalitet på tværs af vagthold.'
      }
    },
    {
      name: { en: 'Feedback-driven optimization', da: 'Feedback-drevet optimering' },
      level: 4,
      text: {
        en: 'Actively uses user feedback and performance metrics to optimize support workflows and personal service delivery.',
        da: 'Opsøger og bruger aktivt feedback fra brugere og målinger til at optimere supportflowet og den personlige serviceleverance.'
      }
    },
    {
      name: { en: 'Team cooperation & collaboration', da: 'Teamarbejde & samarbejde (ESFJ-T)' },
      level: 5,
      text: {
        en: 'Acts as a strong bridge between 1st, 2nd, and 3rd line. Promotes alignment, a positive team spirit, and smooth collaboration across specialized teams.',
        da: 'Fungerer som en stærk bro mellem 1st, 2nd og 3rd line. Skaber godt humør, alignment og et smidigt samarbejde på tværs af faggrupper.'
      }
    }
  ],
  workExperience: [
    {
      date: 'May. 2026 - Present',
      company: 'Customer Support Specialist - CCC Nordic',
      description: {
        en:
          'At CCC Nordic, I deliver high-volume 1st and 2nd line phone support with a calm, structured, and solution-focused approach. ' +
          'I perform advanced technical troubleshooting, prioritize incoming incidents based on business impact, and ensure detailed documentation in our ITSM tools. ' +
          'The role has significantly sharpened my ability to manage complex cases, set clear expectations, and maintain high service delivery across busy shifts.',
        da:
          'Yder daglig 1st og 2nd line telefonisk support i et it-miljø med højt tempo, hvor jeg håndterer komplekse tekniske problemstillinger og guider brugere sikkert igennem fejlfinding. ' +
          'Jeg foretager visitation og prioritering af incidents baseret på forretningskritikalitet, dokumenterer sager grundigt i ITSM-systemer og følger dem helt til afslutning. ' +
          'Rollen har styrket min evne til at bevare det fulde overblik under pres og sikre en ensartet, høj servicekvalitet på alle vagter.'
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
          'Udviklede og vedligeholdt skræddersyede softwareløsninger og virksomhedens CMS. Implementerede nye funktioner, ' +
          'fejlrettede eksisterende systemer og bidrog til stabile løsninger gennem tæt samarbejde med teamet.'
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
          'Delivered comprehensive 1st and 2nd level IT support for students, teachers, and administrative staff. ' +
          'Diagnosed and resolved hardware, software, and network issues, configured and deployed workstations, and managed users in Active Directory and Entra ID. ' +
          'Set up and maintained AV equipment in classrooms and meeting rooms, including projectors, screens, and cabling. ' +
          'Worked structured with ITIL-based IT Service Management for incident handling, asset management, and documentation, ensuring stable and reliable operations.',
        da:
          'Leverede bred 1st og 2nd level IT-support til både elever, undervisere og administrative medarbejdere. ' +
          'Diagnosticerede og løste hardware-, software- og netværksfejl, klargjorde arbejdsstationer samt administrerede brugere og rettigheder i Active Directory og Entra ID. ' +
          'Opsatte og vedligeholdt AV-udstyr i klasse- og mødelokaler, herunder projektorer, skærme og kabling. ' +
          'Arbejdede struktureret med ITIL-baseret IT Service Management til incidenthåndtering, asset management og fejlsøgning, hvilket sikrede stabil og effektiv supportdrift.'
      }
    }
  ],
   education: [
    {
      date: 'Jun. 2022 - Feb. 2025',
      name: {
        en: 'Software Engineering at DTU',
        da: 'Software Engineering på DTU'
      },
      description: {
        en:
          'Gained a deep analytical foundation in software architecture, operating systems, and distributed applications. ' +
          'This engineering background significantly strengthens my root-cause analysis skills, allowing me to understand complex system dependencies and troubleshoot advanced errors that go beyond standard support procedures.',
        da:
          'Studerede Software Engineering på DTU med fokus på softwarearkitektur, operativsystemer og distribuerede applikationer. ' +
          'Uddannelsen har givet mig stærke analytiske evner og en dyb systemforståelse, hvilket ruster mig til avanceret fejlsøgning og root-cause analyse i komplekse it-infrastrukturer.'
      },
      legacyDetails:
        'Operating Systems, Algorithms and Data Structures, Computer Systems, Introduction to Coordination of Distributed Applications, UX Design and Prototype Development, Software Engineering, Project Management, Physics 1, Introductory Programming'
    },
    {
      date: 'Jan. 2016 - Jun. 2021',
      name: {
        en: 'Datatechnician specialized in Programming - EUX TEC Ballerup',
        da: 'Datatekniker med speciale i programmering - EUX TEC Ballerup'
      },
      description: {
        en:
          'Completed a comprehensive IT education combining software development with enterprise operations, built directly on top of an initial support/infrastructure specialization. ' +
          'Acquired robust skills within Windows/Linux server technologies, virtualization, and networking. ' +
          'The program had a strong emphasis on IT Service Management (ITIL), bridges the gap between technical operations and structured end-user support.',
        da:
          'Uddannet datatekniker med kombination af softwareudvikling, netværk og it-drift, som bygger direkte videre på en indledende specialisering inden for support/infrastruktur. ' +
          'Opnåede bred teknisk indsigt i Windows/Linux serverteknologier, netværk og virtualisering. ' +
          'Uddannelsen indeholdt stort fokus på IT Service Management (ITIL), hvilket sikrer en struktureret og procesorienteret tilgang til support og fejlsøgning.'
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
          'Leverede kundeservice og rådgivning omkring reservedele og tilbehør. Arbejdede med salg, problemløsning og vejledning af kunder, hvilket styrkede mine kommunikationsevner og min evne til hurtigt at afdække kunders behov.'
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
          'Leverede daglig kundeservice og rådgivning i et travlt butiksmiljø. Hjalp kunder med at finde de rette produkter og sikrede en positiv kundeoplevelse gennem god kommunikation og høj service.'
      }
    },
    {
      date: 'Apr. 2017 - Jun. 2021',
      name: 'Beredskabets venner',
      description: {
        en:
          'Supported tasks related to customer service, communications, and situation handling in time-critical settings. ' +
          'This experience sharpened my ability to stay calm, coordinate effectively, and act decisively when operations are critical and unexpected situations demand a fast, level-headed response.',
        da:
          'Deltog i frivilligt arbejde med fokus på kommunikation, koordinering og håndtering af uforudsete situationer under tidspres. ' +
          'Erfaringen har skærpet min evne til at bevare overblikket, samarbejde effektivt og handle roligt, når driften er kritisk, og situationen kræver hurtig og korrekt handling.'
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
    title: 'IT Support Specialist | Service Desk | 1st & 2nd Line',
    quote: {
      en: 'Service-minded IT supporter motivated by contributing to a busy ServiceDesk with structured incident handling and a calm approach under pressure.',
      da: 'Serviceminded IT-supporter, der motiveres af at bidrage til en travl ServiceDesk med struktureret incidenthåndtering og ro under pres.'
    },
    info: {
      en:
        'IT supporter highly motivated by delivering reliable support for a ServiceDesk to keep internal users running smoothly. ' +
        'I have strong hands-on experience with 1st and 2nd line phone support, structured incident handling, and clear communication under pressure. ' +
        'I take pride in ownership of tickets from first contact to final resolution, ensuring expectations are aligned. ' +
        'My logical and development background allows me to analyze complex technical errors quickly, while always maintaining a calm, empathetic, and service-minded approach.',
      da:
        'IT-supporter med stor motivation for at levere stabil support i en ServiceDesk, der sikrer, at kollegerne hjælpes godt videre. ' +
        'Jeg har solid praktisk erfaring med både 1st og 2nd line support, telefonisk fejlfinding og struktureret sagsbehandling i travle driftsmiljøer. ' +
        'Jeg tager fuldt ejerskab over incidents fra første opkald til endelig løsning og sikrer en tæt, tryg forventningsafstemning med brugeren. ' +
        'Min tekniske baggrund gør mig i stand til hurtigt at analysere komplekse problemer og eskalere korrekt, uden at miste det servicemindede fokus.'
    },
    skillInfo: {
      en:
        'My profile bridges technical understanding with structured service delivery based on ITIL processes. ' +
        'I work methodically with Incident Management, documentation, and root-cause analysis to ensure high service quality. ' +
        'I am adept at translating technical concepts into simple instructions for users with varied backgrounds. ' +
        'My software engineering background acts as a strong tool for understanding advanced systems and collaborating effectively with specialized 3rd line teams.',
      da:
        'Min profil forener teknisk problemløsning med struktureret serviceleverance baseret på ITIL-processer. ' +
        'Jeg arbejder metodisk med Incident Management, dokumentation og fejlsøgning, hvilket sikrer en ensartet og høj servicekvalitet. ' +
        'Jeg er vant til at omstille min kommunikation og gøre tekniske løsninger letforståelige for alle typer af medarbejdere. ' +
        'Min baggrund inden for softwareudvikling giver mig desuden en stærk fordel, når komplekse systemfejl skal gennemskues og formidles videre til specialister.'
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
