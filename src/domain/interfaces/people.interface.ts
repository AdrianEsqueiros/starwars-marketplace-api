export interface IPeople {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  vehicles: string[];
  url: string;
  starships: string[];
  created: Date;
}
export interface IPeople {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  vehicles: string[];
  starships: string[];
  url: string;
}

export interface IPeopleGet {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPeople[];
}

export interface IPeopleResponse {
  results: IPeople[];
  total: number;
}
