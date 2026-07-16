export interface Service {
  id: number;
  name: string;
  img: string;
  description: string;
  link: string;
}

const services: Service[] = [
  {
    id: 1,
    name: 'Web Development',
    img: 'assets/webdevelopment.png',
    description: 'I like to code things from scratch, and enjoy bringing ideas to life in the browser.',
    link: '/about',
  },
  {
    id: 2,
    name: 'UI/UX Design',
    img: 'assets/UIUXDesign.png',
    description: 'I value simple content structure, clean design patterns, and thoughtful interactions.',
    link: '/about',
  },
  {
    id: 3,
    name: 'FreeLancing',
    img: 'assets/Freelancing.jpg',
    description: 'I want to set my self free and work on multiple projects and bringing my ideas to life.',
    link: '/about',
  },
];

export default services;
