import { Pipe } from '@angular/core';

@Pipe({
    name: 'time'
})
export class Time {
    transform(time) {
        if (time != undefined) {
            let temp = time;
            temp = time.substring(0, time.length - 1);
            temp = temp.replace("T","-");
            temp = temp.replace(/:/g,"-");
            return temp.split("-")[2] + "." + temp.split("-")[1] + "." + temp.split("-")[0]
                + " " + temp.split("-")[3] + ":" + temp.split("-")[4];
        }
    }
}
