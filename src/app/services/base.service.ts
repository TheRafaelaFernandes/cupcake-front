import {HttpClient, HttpParams, HttpUserEvent} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import {from, Observable} from "rxjs";
import {environment} from "../../environments/environment";

export class BaseService<T> {
    public urlBase: string;
    public fullUrl: string;

    private parameters: HttpParams = new HttpParams();

    constructor(public http: HttpClient,
                public path: string) {

        this.urlBase = environment.urlBase;
        this.fullUrl = `${this.urlBase}${path}`;
    }

    public addParameter(key: string, value: any): void {
        if (this.parameters.has(key)) {
            this.parameters = this.parameters.set(key, value);
        } else {
            this.parameters = this.parameters.append(key, value);
        }
    }

    private getOptions(responseType?: any): any {
        const httpOptions = {};

        if (this.parameters) {
            httpOptions["params"] = this.parameters;
        }
        if (responseType) {
            httpOptions["responseType"] = responseType;
        }
        return httpOptions;
    }

    public getById(id: number | string, route?: string): Observable<T> {
        const url = route ? `${this.fullUrl}${id}/${route}/` : `${this.fullUrl}${id}/`;
        return this.http.get<T>(url, this.getOptions())
            .pipe(
                tap(response => response as HttpUserEvent<T>),
                catchError(ex => from([]))
            );
    }

    public options(): Observable<any> {
        return this.http.options<T>(this.fullUrl, this.getOptions())
            .pipe(
                tap(response => response as HttpUserEvent<any>),
                map(response => response["actions"]["POST"]),
                catchError(ex => from([]))
            );
    }

}
