type onboardingSwiperDataType = {
  id: number;
  title: string;
  description: string;
  sortDescription: string;
  image: any;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
};
