/**
 * Created by Sebastian on 20.12.2016.
 */

import {Pipe} from '@angular/core';

@Pipe({
  name: 'birthday'
})
export class Birthday {
  transform(birthday) {
    if(birthday != undefined){
      return birthday.split("-")[2] + "." + birthday.split("-")[1] + "." + birthday.split("-")[0];
    }
  }
}
