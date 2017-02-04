export class UtilitiesMock {
    user: any;
    userData:any;
    allPlayers: any[];

    constructor() {
        this.user = {
            uid: "12345"
        }

        this.userData = {
            isTrainer: true
        }

        this.allPlayers = [
            {
                id: "12345",
                birthday: "",
                email: "",
                firstname: "",
                gender: "",
                isPlayer: true,
                isTrainer: false,
                lastname: "",
                picUrl: "",
                pushId: "",
                state: 0,
                team: "16"
            },
            {
                id: "54321",
                birthday: "",
                email: "",
                firstname: "",
                gender: "",
                isPlayer: true,
                isTrainer: false,
                lastname: "",
                picUrl: "",
                pushId: "",
                state: 0,
                team: "16"
            }
        ]

    }

}