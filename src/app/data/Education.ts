import type { Education } from '../../types/data';

const education: Education[] = [
  {
    id: 1,
    school: 'Software Engineering at DTU',
    degree: 'Software Engineering',
    duration: 'June 2022 - January 2025',
    details:
      'Operating Systems, Algorithms and Data Structures, Computer Systems, Introduction to Coordination of Distributed Applications, UX Design and Prototype Development, Software Engineering, Project Management, Physics 1, Introductory Programming',
  },
  {
    id: 2,
    school: 'EUX TEC Ballerup - Datatechnician specialized in Programming',
    degree: 'Datatechnician',
    duration: 'January 2016 - June 2021',
    details:
      'Information Technology, Technical Subjects, Advanced Operating Systems, Backup Technology, Computer Technology, Server Technology, Programming (Java), Programming (C#), Database Systems, IT Requirement Specification, System Development and Project Management, Virtualization, Embedded Controller, Programming of Mobile Applications, IT Service Management, Network Technology, Web Server Technology',
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
    details:
      'Danish, Mathematics, English, Photography / Editing, Cadet line subject',
  },
  {
    id: 5,
    school: 'Public School Løjtegårdsskolen',
    degree: 'Primary School',
    duration: 'June 2003 - June 2013',
    details: 'Many subjects',
  },
];

export default education;
