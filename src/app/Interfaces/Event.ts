/*
  @project Roadmap
  @author xhencl02
*/

export interface event{
  starred: boolean,
  event_id: number,
  img_path:string,
  name: string,
  description: string,
  type_tag_ba: number,
  type: string,
  targetg_tag_ba: number,
  tg: string,
  duration_type: number,
  rating: number,
  org_name: string,
  location:string,
  topic_tag_ba: number,
  price:string,
  counter: number,
  owner_u_id: number,
  links: link[],
  reviews: review[],
  terms: dates[]

}
export interface dates{
start_date: string | null;
end_date: string | null;
event_name: string;
event_id: 4;
name: string;
}
export interface link{
  id: number,
  url: string
}
export interface getEvent{
  starred?: boolean,
  event_id?: number,
  img_path?:string,
  name?: string,
  description?: string,
  type_tag_ba?: number,
  type?: string,
  targetg_tag_ba?: number,
  tg?: string,
  duration_type?: number,
  topic_tag_ba?: number,
  rating?: number,
  org_name?:string,
  location?:string
  price?:string,
  counter?: number,
  owner_u_id?: number,
  links?: link[],
  reviews?: review[],
  user?: userData,
  terms?: dates[];
}
export interface userData{
  review?: review,
  favorite?: boolean,
  visited?: boolean,
  rating?: number
}
export interface review{
  author?: string;
  content: string;
  img_path: string;
  date: string;
  value: number;
  is_public?: boolean;
}
export interface formReview{
  content: string;
  value: number;
  is_public: boolean;
}
export interface frontpage{
  total_events?: number
  total_users?: number
  total_upcoming?: number
  trending?: event[];
}


export const EventTopics: tagba[] = [
  { name: "Matematika", id: 1 },
  { name: "Fyzika", id: 2 },
  { name: "Biologie", id: 4 },
  { name: "Chemie", id: 8 },
  { name: "Zeměpis", id: 16 },
  { name: "Sport", id: 32 },
  { name: "Podnikání", id: 64 },
  { name: "Ekonomie", id: 128 },
  { name: "Hudba", id: 256 },
  { name: "Výtvarné umění", id: 512 },
  { name: "Literatura", id: 1024 },
  { name: "Herectví", id: 2048 },
  { name: "Tanec", id: 4096 },
  { name: "Historie", id: 8192 },
  { name: "Společenské vědy ", id: 16384 },
  { name: "Cizí jazyky", id: 32768 },
  { name: "Prezentační dovedlnosti", id: 65536 },
  { name: "Dobrovolnictví", id: 131072 },
  { name: "Příroda", id: 262144 },
  { name: "Cestování", id: 524288 },
  { name: "Zdraví", id: 1048576 },
  { name: "Robotika", id: 2097152 },
  { name: "Programování", id: 4194304 },
  { name: "Kyberbezpečnost", id: 8388608 },
  { name: "Ostatní témata", id: 1677721 }];
export const EventTypes: tagba[] = [
  { name: "Soutěž", id: 1 },
  { name: "Konference", id: 2 },
  { name: "Tábor/soustředění", id: 4 },
  { name: "Rozvojový program", id: 8 },
  { name: "Ostatní typy", id: 16 }
]
export const EventLength: tagba[] = [
  { name: "Jednodenní", id: 1 },
  { name: "Krátkodobé", id: 2 },
  { name: "Dlouhodobé", id: 4 }]
export const EventSchool: tagba[] = [
  { name: "Vysoká škola", id: 1 },
  { name: "Střední škola", id: 2 },
  { name: "Základní škola", id: 4 }]
  export interface tagba{
    name: string;
    id: number;
  }
