/**
 * Created by Sebastian on 20.12.2016.
 */

import {Pipe} from '@angular/core';

@Pipe({
  name: 'gender'
})
export class Gender {
  transform(gender) {
    if (gender === "m"){
      return "männlich"
    }else if (gender === "w"){
      return "weiblich"
    }
  }
}
