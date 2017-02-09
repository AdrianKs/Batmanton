export class InvitesProviderMock {
    allInvites: Array<any>;
    allPlayers: Array<any>;
    allMatchdays: Array<any>;

    constructor() {

    }

    setMatchdays(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            var matchdayArray = [
                {
                    id: "1",
                    home: false,
                    opponent: "Mustergegner",
                    team: "1",
                    time: "2017-03-02T12:00:00",
                    location: {
                        street: "Musterstraße 23",
                        zipcode: "1234"
                    }
                }
            ]
            this.allMatchdays = matchdayArray;
            if (this.allMatchdays != undefined) {
                resolve("success");
            }
        }).catch((reject) => {
            reject("failed");
        })
    }

    setInvites(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            var inviteArray = [
                {
                    match: "1",
                    recipient: "2222",
                    sender: "1111",
                    state: 0,
                    excuse: ""
                },
                {
                    match: "1",
                    recipient: "3333",
                    sender: "1111",
                    state: 0,
                    excuse: "Krank"
                }
            ]
            this.allInvites = inviteArray;
            if (this.allInvites != undefined) {
                resolve("success");
            }
        }).catch((reject) => {
            reject("failed");
        })
    }

    setPlayers(): Promise<{ status: string }> {
        return new Promise((resolve) => {
            var playerArray = [
                {
                    id: "1111",
                    birthday: "1990-01-01",
                    email: "test1@test.de",
                    firstname: "Max",
                    gender: "m",
                    isPlayer: true,
                    isTrainer: false,
                    lastname: "Mustermann",
                    picUrl: "",
                    state: 0,
                    team: "10"
                },
                {
                    id: "2222",
                    birthday: "1991-01-01",
                    email: "test2@test.de",
                    firstname: "Erika",
                    gender: "f",
                    isPlayer: true,
                    isTrainer: true,
                    lastname: "Musterfrau",
                    picUrl: "",
                    state: 0,
                    team: "10"
                },
                {
                    id: "3333",
                    birthday: "1989-01-01",
                    email: "test3@test.de",
                    firstname: "Test",
                    gender: "m",
                    isPlayer: true,
                    isTrainer: false,
                    lastname: "Person",
                    picUrl: "",
                    state: 0,
                    team: "12"
                }

            ]
            this.allPlayers = playerArray;
            if (this.allPlayers != undefined) {
                resolve("success");
            }
        }).catch((reject) => {
            reject("failed");
        })
    }
}