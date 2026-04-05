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

export type Project = {
  id:          string;
  title:       string;
  date:        string;
  description: string;
  image:       string;
  alt:         string;
};

export type Content = {
  reviews:  Review[];
  faqs:     FaqItem[];
  steps:    Step[];
  projects: Project[];
};

export type ContentKey = keyof Content;
