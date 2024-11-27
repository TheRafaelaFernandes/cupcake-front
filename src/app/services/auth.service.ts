import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AppVariables} from "../app/app.variables";


@Injectable()
export class AuthService {
    private storage = localStorage;


    constructor(public variables: AppVariables,
                public http: HttpClient,
                public router: Router,) {
    }

    get user(): string {
        if (!this.variables.user) {
            const user = this.storage.getItem("user");
            this.variables.user = JSON.parse(user)
        }
        return this.variables.user;
    }

    public logout(): void {
        this.clearCached();
        window.location.href = '/#/login';
    }

    private clearCached(): void {
        this.storage.removeItem("user");
        this.storage.removeItem("preferences");
        this.storage.removeItem("cart");
    }

}
