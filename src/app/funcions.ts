import {PlayerComponent} from "../pages/gameDetails/player.component";
import {Injectable} from "@angular/core";
/**
 * Created by Adrian Kochsiek on 12.02.2018.
 */

@Injectable()
export class Functions {

  constructor(){}

  openProfile(item, navCtrl) {
    navCtrl.push(PlayerComponent, {player: item});
  }
}
