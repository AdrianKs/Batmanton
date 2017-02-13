/**
 * Created by Sebastian on 20.12.2016.
 */

import {Pipe} from '@angular/core'
import {Utilities} from '../../app/utilities';

@Pipe({
  name: 'birthday'
})
export class Birthday {
  constructor(public utilities: Utilities) {
  }

  transform(birthday) {
    if(birthday != undefined){
      return birthday.split("-")[2] + "." + birthday.split("-")[1] + "." + birthday.split("-")[0] + " (" + this.utilities.calculateAge(birthday) + " Jahre)";
    }
  }
}
