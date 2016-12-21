/**
 * Created by kochsiek on 15.12.2016.
 */
export let loggedInUser;
export let allTeams: Array<any>;

export function setUser (user) {
  loggedInUser = user;
}

export function setTeams(teamArray) {
  allTeams = teamArray;
}
