import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {ToastService} from "../services/toast.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public toast: ToastService,
    ) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const clonedReq = req.clone();
        return next.handle(clonedReq);
    }
}
