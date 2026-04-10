export type Review = {
  id:   string;
  name: string;
  type: string;
  text: string;
};

export type FaqItem = {
  id:       string;
  question: string;
  answer:   string;
};

export type Step = {
  id:    string;
  n:     string;
  title: string;
  desc:  string;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id:          string;
  kicker:      string;
  title:       string;
  description: string;
  scope:       string;
  outcome:     string;
  tags:        string[];
  images:      ProjectImage[];
};

export type Content = {
  reviews:  Review[];
  faqs:     FaqItem[];
  steps:    Step[];
  projects: Project[];
};

export type ContentKey = keyof Content;
