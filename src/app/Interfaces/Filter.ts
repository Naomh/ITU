/*
  @project Roadmap
  @author xhencl02
*/

/*4
type (Seminář, Tábor...)
len (1 - jednodenni, 2 - short term, 4 - long term)
topic (Math...)
tg    target group (1 - ZŠ, 2 - SŠ, 4 - VŠ)

jsou všechno bitarrays jako integer (viz linux práva 0777)
q je querry string na matchování obsahu/názvů
s je sort mechanika
0 - most popular
1 - best ranking
2 - newest
3 - cheapest
4 - upcoming
*/
export interface filter{
  type?: number;
  len?: number;
  topic?: number;
  tg?: number;
  q?: string;
  s?: number;
}
