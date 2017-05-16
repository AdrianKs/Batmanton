import { Pipe } from '@angular/core';

@Pipe({
    name: 'matchTime'
})
export class MatchTime {
    transform(time) {
        if (time != undefined) {
            time = time.substring(0, time.length - 1);
            time = time.replace("T","-");
            time = time.replace(/:/g,"-");
            return time.split("-")[2] + "." + time.split("-")[1] + "." + time.split("-")[0]
                + " - " + time.split("-")[3] + ":" + time.split("-")[4];
        }
    }
}
