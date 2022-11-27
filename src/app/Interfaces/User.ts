/*
  @project Roadmap
  @author xsvond00
*/

export interface LoginFormUser {
  username: string;
  passhash: string;
}
export interface RegisterFormUser extends LoginFormUser {
  email: string;
  firstname?: string;
  lastname?: string;
}
export interface Badge{
badge_id: number;
name: string;
img_path: string;
xp_value: number;
get_rate: number;
description: string;
}
export interface UserDetails extends ProfileInfo {
  register_date?: Date,
  xp?: number,
  level?:number,
  brief?: string,
  badges?: Badge[],
  f_badges?: Badge[],
  xp_next?: number,
  favorites?: number[]
}
export interface ProfileInfo{
  u_id?: number,
  username?: string,
  email?: string,
  brief?: string;
  role_id?: number,
  firstname?: string,
  lastname?: string,
  img_path?: string | null,
  passhash?: string;
}
export interface loggedUser {
  role_id?: number,
  username?: string,
  u_id?: number,
  viewUsr?: number,
  viewEvent?:number,
  favorites?: any[]
 }
