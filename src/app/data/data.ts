export interface Experience {
  id: number;
  title: string;
  duration: string;
  description: string;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  duration: string;
  details?: string;
}

export const workExperiences: Experience[] = [
  {
    id: 1,
    title: 'Developer at ITAGIL',
    duration: 'March 2025-December 2025',
    description: 'I have been working on different projects, and developing web hosting solutions for the customers, as well as web development.',
  },
  {
    id: 2,
    title: 'Alex Cykler (part-time)',
    duration: '2022-2023',
    description: 'I have been doing E-commence type of work, where i have been working with the website and the different products. I have also been working with the different customers and helping them with their problems.',
  },
  {
    id: 3,
    title: 'Datatechnician, specialized in Programming',
    duration: '2016-2022',
    description: 'While i was studying i was able to work with the different projects and learn alot from that.',
  },
  {
    id: 4,
    title: 'Mobile App Development for Final Exam',
    duration: '2021-2021',
    description: "Requirement's analysis and requirement elicitation. Android studio. Java. Java Spring. GitHub. Microsoft SQL Server. REST API",
  },
  {
    id: 5,
    title: 'Mobile App Development',
    duration: '2020-2020',
    description: 'Development of mobile applications. Version Control GitHub. Scrum',
  },
  {
    id: 6,
    title: 'Web Development for KADK',
    duration: '2018-2019',
    description: 'Cooperate as a team to create a clean interface. UX tests to improve UI of webservices. Quality assurance tests and reliability optimization. Project Deployment to web hosting services.',
  },
];

export const otherExperiences: Experience[] = [
  {
    id: 1,
    title: 'Bog og Ide',
    duration: 'December 2019 - December 2025',
    description: 'Sales of books, board games, and toys. Assisted customers with their requests.',
  },
  {
    id: 2,
    title: 'Teaching Assistant (TA) on DTU',
    duration: 'January 2025 - January 2025',
    description: 'Assisted students with courses, provided feedback on reports, answered questions, and managed projects.',
  },
  {
    id: 3,
    title: 'Thansen',
    duration: 'December 2024 - January 2025',
    description: 'Worked with and sold fireworks during the holiday season.',
  },
  {
    id: 4,
    title: 'Beredskabets Venner',
    duration: 'April 2017 - June 2021',
    description: 'Customer service, communications, and situation handling.',
  },
];

export const education: Education[] = [
  {
    id: 1,
    school: 'Software Engineering at DTU',
    degree: 'Software Engineering',
    duration: 'June 2022 - January 2025',
    details: 'Operating Systems, Algorithms and Data Structures, Computer Systems, Introduction to Coordination of Distributed Applications, UX Design and Prototype Development, Software Engineering, Project Management, Physics 1, Introductory Programming',
  },
  {
    id: 2,
    school: 'EUX TEC Ballerup - Datatechnician specialized in Programming',
    degree: 'Datatechnician',
    duration: 'January 2016 - June 2021',
    details: 'Information Technology, Technical Subjects, Advanced Operating Systems, Backup Technology, Computer Technology, Server Technology, Programming (Java), Programming (C#), Database Systems, IT Requirement Specification, System Development and Project Management, Virtualization, Embedded Controller, Programming of Mobile Applications, IT Service Management, Network Technology, Web Server Technology',
  },
  {
    id: 3,
    school: 'STX Ørestad Gymnasium',
    degree: 'STX',
    duration: 'June 2014 - December 2015',
    details: 'Danish, Mathematics, English, Physics, BioTechnology',
  },
  {
    id: 4,
    school: 'Odsherred Efterskole 10th grade',
    degree: '10th Grade',
    duration: 'June 2013 - June 2014',
    details: 'Danish, Mathematics, English, Photography / Editing, Cadet line subject',
  },
  {
    id: 5,
    school: 'Public School Løjtegårdsskolen',
    degree: 'Primary School',
    duration: 'June 2003 - June 2013',
    details: 'Many subjects',
  },
];
