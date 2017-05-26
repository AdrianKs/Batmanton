export class UtilitiesMock {
    user: any;
    userData:any;
    allPlayers: any[];
    allTeams: Array<any>;

    constructor() {
        this.user = {
            uid: "1",
            email: "max.mustermann@mail.com",
            emailVerified: false,
        }

        this.userData = {
            birthday : "1999-01-01",
            email : "max.mustermann@mail.com",
            firstname : "Max",
            gender : "m",
            helpCounter : 0,
            isDefault : false,
            isPlayer : true,
            isTrainer : true,
            lastname : "Mustermann",
            picUrl : "www.picUrlMax.com",
            platform : "ios",
            state : 0,
            team : "2"
        }

        this.allPlayers = [
            {
                id: "1",
                birthday : "1999-01-01",
                email : "max.mustermann@mail.com",
                firstname : "Max",
                gender : "m",
                helpCounter : 0,
                isDefault : false,
                isPlayer : true,
                isTrainer : true,
                lastname : "Mustermann",
                picUrl : "www.picUrlMax.com",
                platform : "ios",
                state : 0,
                team : "2"
            },
            {
              id: "2",
              birthday : "1999-01-01",
              email : "manuela.musterfrau@mail.com",
              firstname : "Manuela",
              gender : "f",
              helpCounter : 0,
              isDefault : false,
              isPlayer : true,
              isTrainer : true,
              lastname : "Musterfrau",
              picUrl : "www.picUrlManuela.com",
              platform : "ios",
              state : 0,
              team : "2"
            },
            {
              id: "3",
              birthday : "1998-05-12",
              email : "emil.erpel@mail.com",
              firstname : "Emil",
              gender : "m",
              helpCounter : 1,
              isDefault : false,
              isPlayer : true,
              isTrainer : false,
              lastname : "Erpel",
              picUrl : "www.picUrlEmil.com",
              platform : "android",
              state : 0,
              team : "0"
            },
            {
              id: "4",
              birthday : "1990-03-07",
              email : "justus.jonas@mail.com",
              firstname : "Justus",
              gender : "m",
              helpCounter : 2,
              isDefault : false,
              isPlayer : false,
              isTrainer : true,
              lastname : "Jonas",
              picUrl : "www.picUrlJustus.com",
              platform : "ios",
              state : 0,
              team : "1"
            },
            {
              id: "5",
              birthday : "2001-02-10",
              email : "emma.watson@mail.com",
              firstname : "Emma",
              gender : "f",
              helpCounter : 0,
              isDefault : false,
              isPlayer : true,
              isTrainer : false,
              lastname : "Watson",
              picUrl : "www.picUrlEmma.com",
              platform : "android",
              state : 0,
              team : "4"
            },
            {
              id: "6",
              birthday : "2009-02-08",
              email : "bibi.blocksberg@mail.com",
              firstname : "Bibi",
              gender : "f",
              helpCounter : 0,
              isDefault : false,
              isPlayer : true,
              isTrainer : true,
              lastname : "Blocksberg",
              picUrl : "www.picUrlBibi.com",
              platform : "ios",
              state : 0,
              team : "5"
            }
        ];

        this.allTeams = [
          {
            ageLimit : "0",
            id: "1",
            name : "Wunderschöneres Team",
            players : [ "3"],
            sclass : "1",
            type : "Normal"
          },
          {
            ageLimit : "19",
            id: "2",
            name : "Neues Team",
            players : [ "1" ],
            sclass : "1",
            type : "Normal"
          },
          {
            ageLimit : "17",
            id: "3",
            name : "U17 S2 Team Normal",
            players : ["4"],
            sclass : "2",
            type : "Normal"
          },
          {
            ageLimit : "15",
            id: "4",
            name : "U15 S1 Team Normal",
            players : ["5"],
            sclass : "1",
            type : "Normal"
          },
          {
            ageLimit : "13",
            id: "5",
            name : "U15 S3 Team Normal",
            players : ["6"],
            sclass : "3",
            type : "Normal"
          }
        ]
    }

  calculateAge(birthdayString) {
    if (birthdayString != undefined) {
      let birthdayDate = new Date(birthdayString);

      let todayDate = new Date();
      let todayYear = todayDate.getFullYear();
      let todayMonth = todayDate.getMonth();
      let todayDay = todayDate.getDate();
      let age = todayYear - birthdayDate.getFullYear();

      if (todayMonth < birthdayDate.getMonth()) {
        age--;
      }

      if (birthdayDate.getMonth() == todayMonth && todayDay < birthdayDate.getDate()) {
        age--;
      }
      return age;
    }
  }

  getRelevantTeams(birthdayString) {
    if (birthdayString != undefined) {
      let age = this.calculateAge(birthdayString);
      let relevantTeams: Array<any> = [];
      this.allTeams.forEach(function (team) {
        if (team.ageLimit > age || team.ageLimit == 0) {
          relevantTeams.push(team);
        }
      });
      return relevantTeams;
    }
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
