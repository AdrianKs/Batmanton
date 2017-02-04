export class TeamsProviderMock {
    teams: any = [];
    team: any;
    teamId: any;
    allPlayers: any;
    teamHasPlayers: any;
    manCounter: any = 0;
    womanCounter: any = 0;

    constructor() {
        this.teams = [];
    }

    buildTeam(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            for (let i in this.teams) {
                if (this.teams[i].id == this.teamId) {
                    this.team = this.teams[i];
                }
            }
            if (this.team != undefined) {
                resolve("success");
            }
        }).catch((reject) => {
            reject("failed");
        })
    }

    updateTeamInfos(ageLimit: string, name: string, type: string, sclass: string): Promise<{ status: string }> {
        return new Promise((resolve, reject) => {
            for (let i in this.teams) {
                if (this.teams[i].id == this.teamId) {
                    this.team = this.teams[i];
                }
            }
            if (this.team != undefined) {
                this.team.ageLimit = ageLimit;
                this.team.name = name;
                this.team.type = type;
                this.team.sclass = sclass;
                resolve("success");
            } else{
                reject("team undefinded");
            }
        })
    }

    countGenders(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            this.manCounter = 0;
            this.womanCounter = 0;
            let player;
            for (let i in this.allPlayers) {
                player = this.allPlayers[i];
                if (player.team == this.teamId) {
                    if (player.gender == "m") {
                        this.manCounter++;
                    } else {
                        this.womanCounter++;
                    }
                }
            }
            resolve("success");
        }).catch((reject) => {
            reject("failed");
        })

    }

    refreshPlayers(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            this.allPlayers = [
                {
                    id: "12345",
                    birthday: "",
                    email: "a@b.de",
                    firstname: "Alan",
                    gender: "m",
                    isPlayer: true,
                    isTrainer: false,
                    lastname: "Bieber",
                    picUrl: "",
                    pushId: "",
                    state: 0,
                    team: "abcdefgh"
                },
                {
                    id: "54321",
                    birthday: "",
                    email: "s@a.de",
                    firstname: "Sara",
                    gender: "f",
                    isPlayer: true,
                    isTrainer: false,
                    lastname: "Alan",
                    picUrl: "",
                    pushId: "",
                    state: 0,
                    team: "ijklmnop"
                }
            ]
            resolve("success");
        })

    }

    checkIfTeamsHasPlayers(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            for (let i in this.teams) {
                if (this.teams[i].id == this.teamId) {
                    this.team = this.teams[i];
                }
            }
            if (this.team != undefined) {
                let playerarray = this.team.players;
                if (playerarray.length == 0) {
                    this.teamHasPlayers = false;
                    resolve("success");
                } else if (playerarray.length == undefined) {
                    this.teamHasPlayers = false;
                    resolve("success");
                } else {
                    this.teamHasPlayers = true;
                    resolve("success");
                }
            }
        })
    }

    setTeams(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            var teams = [
                {

                    id: "abcdefgh",
                    ageLimit: "15",
                    type: "1",
                    name: "Team 1",
                    sclass: "S1",
                    players: {
                        0: "12345"
                    }

                },
                {

                    id: "ijklmnop",
                    ageLimit: "0",
                    type: "0",
                    name: "Team 2",
                    sclass: "S2",
                    players: {
                        0: "54321"
                    }

                }]
            this.teams = teams;
            if (this.teams != undefined) {
                resolve("success");
            }
        }).catch((reject) => {
            reject("failed");
        })


    }




}