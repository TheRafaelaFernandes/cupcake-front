import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Injectable()
export class MainService {

    public changeTitle = new Subject<string>();
    public changeSnackBar = new Subject<string>();

    constructor(public spinner: NgxUiLoaderService) {
    }
}
