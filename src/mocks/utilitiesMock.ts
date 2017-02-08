export class UtilitiesMock {
    user: any;
    allPlayers: any[];
    allTeams: Array<any>;

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
        ];

        this.allTeams = [
          {
            ageLimit : "0",
            name : "Wunderschöneres Team",
            players : [ "cJVEyr1kIjYUceEY4y28ajdV15A2", "VIOuJYfLV1agcw28Y2Fg4x5V4Vr1", "ZP2dhitNYiSgLazCKprcnBi4hSx2", "EFXUidvwr3ZGc3qdCDMREMHjowb2", "5TkNxVB7ccRl2bXlSN5DtKrI9i93", "gDp8yP19ylYXo9QVUYg7Kuz89IT2", "sKHaaDGmPfTDbGmuIQPdatbzQVt1", "B5lr3SSlCrY2F701fwyFdC43dif1" ],
            sclass : "S1",
            type : "Normal"
          },
          {
            ageLimit : "19",
            name : "Neues Team",
            players : [ "PtbOfLmhBuQnixxVLgXHWVbvxlH2" ],
            sclass : "S1",
            type : "Normal"
          },
        ]
    }

    setPlayers(): Promise<{status: string}> {
        var test = this.allPlayers;
        return new Promise((resolve)=>{
           resolve('success');
        }).catch((reject)=>{
            reject('failed');
        })
    }
}
