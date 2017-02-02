export class UtilitiesMock {
    user: any;
    allPlayers: any[];

    constructor() {
        this.user = {
            uid: "12345"
        }

        this.allPlayers = [
            {
                id: "12345",
                birthday: "",
                email: "",
                firstname: "",
                gender: "m",
                isPlayer: true,
                isTrainer: false,
                lastname: "",
                picUrl: "",
                platform: "ios",
                pushId: "",
                state: 0,
                team: "16"
            },
            {
                id: "54321",
                birthday: "",
                email: "",
                firstname: "",
                gender: "f",
                isPlayer: true,
                isTrainer: false,
                lastname: "",
                picUrl: "",
                platform: "ios",
                pushId: "",
                state: 0,
                team: "16"
            }
        ]
    }

    setPlayers() {
        var test = this.allPlayers;
        var p1 = new Promise(
            function (resolve, reject) {
                if(test != undefined){
                    resolve('success');
                }else{
                    reject('fail');
                }
            });
        return p1;
    }
}