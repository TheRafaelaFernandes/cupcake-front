import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ToastService {

    constructor(public toast: ToastrService) {
    }

    public success(title: string, content: string): void {
        this.toast.success(content, null);
    }

    public error(title: string, content: string): void {
        this.toast.error(content, null);
    }

    public warning(title: string, content: string): void {
        this.toast.warning(content, null);
    }

    public info(title: string, content: string): void {
        this.toast.info(content, null);
    }

}
