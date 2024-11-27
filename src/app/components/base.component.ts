import {Directive, Injector, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ToastService} from "../services/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, Params, Router} from "@angular/router";
import {BaseService} from "../services/base.service";
import {HttpClient} from "@angular/common/http";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Subject} from "rxjs";
import {map, switchMap, take, takeWhile} from "rxjs/operators";
import {MainService} from "./default/main/main.service";
import {Observable} from "rxjs/internal/Observable";
import {MatTabGroup} from "@angular/material/tabs";

export interface BaseOptions {
    pk?: string;
    endpoint: string;
    paramsOnInit?: {};
    retrieveOnInit?: boolean;
    retrieveIdRoute?: string;
    retrieveRoute?: string;
    searchOnInit?: boolean;
    searchRoute?: string;
    nextRoute?: string;
    nextRouteUpdate?: string;
    keepFilters?: boolean;
    noResponse?: boolean;
    pageSize?: number;
    crossTable?: boolean;
    associative?: boolean;
    associativeRoute?: string;
}

export const EVENT = {
    RETRIEVE: 0,
    SAVE: 1,
    UPDATE: 2,
    DELETE: 3,
    SEARCH: 4,
    TOGGLE: 5,
    REORDER: 6,
};

const handler = (event: number, callback?: (event: number) => void) => {
    if (callback) {
        callback(event);
    }
};

@Directive()
export abstract class BaseComponent<T> implements OnInit, OnDestroy {

    @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    public main: MainService;
    public toast: ToastService;
    public dialog: MatDialog;
    public router: Router;
    public activatedRoute: ActivatedRoute;
    public http: HttpClient;
    public service: BaseService<T>;
    public dataSource: MatTableDataSource<T>;
    public formBuilder: UntypedFormBuilder;
    public formGroup: UntypedFormGroup;

    public object: T | {};
    public rawObject: T | {};
    public pk: string;

    public unsubscribe = new Subject();

    protected constructor(public injector: Injector,
                          public options: BaseOptions) {
        this.main = injector.get(MainService);
        this.toast = injector.get(ToastService);
        this.dialog = injector.get<MatDialog>(MatDialog);
        this.router = injector.get(Router);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.http = injector.get(HttpClient);
        this.formBuilder = injector.get(UntypedFormBuilder);
        this.dataSource = new MatTableDataSource<T>();
        this.pk = options.pk || "id";
    }

    public ngOnInit(callback?: () => void) {
        this.createFormGroup();
        if (this.options.retrieveOnInit) {
            this.retrieve(callback);
        } else {
            handler(EVENT.RETRIEVE, callback);
        }

    }

    public ngOnDestroy() {
        this.unsubscribe.next({});
        this.unsubscribe.complete();
    }

    // The method will be implemented in inner class
    public abstract createFormGroup(): void;

    // Convenience getter for easy access to form fields
    get f() {
        return this.formGroup.controls;
    }

    // Convenience getter for easy access to form fields values
    get v() {
        return this.formGroup.value;
    }

    // Navigate to route
    public goToPage(route: string): void {
        const extras: NavigationExtras = {queryParamsHandling: "merge"};
        this.router.navigate([route], extras).then();
    }

    public beforeRetrieve(): Observable<number | string> {

        return this.activatedRoute.params.pipe(
            take(1),
            map((params: Params) => {
                const id = params[this.options.retrieveIdRoute || "action"];
                return id && id !== "create" ? id : null;
            })
        );
    }

    // Retrieve object by id
    public retrieve(callback?: () => void): void {

        // Add parameters to filter retrieve
        if (this.options.paramsOnInit) {
            const parameters = this.options.paramsOnInit;
            Object.keys(parameters).forEach(t => this.service.addParameter(t, parameters[t]));
        }
        // Retrieve object
        this.beforeRetrieve().pipe(
            take(1),
            takeWhile(id => {
                if (!!id) {
                    return true;
                }
                handler(EVENT.RETRIEVE, callback);
                return false;
            }),
            switchMap(id => {
                this.object[this.pk] = id;
                return this.service.getById(id, this.options.retrieveRoute);
            })
        ).subscribe(response => {
            this.rawObject = response;
            this._response(response, EVENT.RETRIEVE, callback);
        });
    }

    private _response(response: any, event: number, callback?: (event: number) => void) {
        if (this.options.noResponse || !([EVENT.RETRIEVE, EVENT.SAVE, EVENT.UPDATE].includes(event))) {
            handler(event, callback);
            return;
        }
        if (response) {
            this.object = response;
            if (this.formGroup) {
                this.formGroup.reset(this.object);
            }

            if (this.options.nextRouteUpdate) {
                if (event === EVENT.SAVE) {
                    this._changeToUpdateMode();
                } else if (event === EVENT.UPDATE) {
                    this.goToPage(this.options.nextRouteUpdate);
                }
            } else if (this.options.nextRoute) {
                if (event === EVENT.SAVE || event === EVENT.UPDATE) {
                    this.goToPage(this.options.nextRoute);
                }
            }
        } else {
            this.object = {};
            this.createFormGroup();
            this._changeToCreateMode();
        }
        handler(event, callback);
    }


    private _changeToCreateMode() {
        const route = this._getPathRoute(this.router.routerState.snapshot.root)
            .map(path => path.replace(":action", "create"));
        this.router.navigate([route.join("/")], {queryParamsHandling: "preserve"}).then();
    }

    private _changeToUpdateMode() {
        const route = this._getPathRoute(this.router.routerState.snapshot.root)
            .map(path => path.replace(":action", this.object[this.pk]));
        this.router.navigate([route.join("/")], {queryParamsHandling: "preserve"}).then();
    }

    private _getPathRoute(route: ActivatedRouteSnapshot) {
        let array = [];
        if (route.routeConfig && route.routeConfig.path !== "") {
            array.push(route.routeConfig.path);
        }
        if (route.firstChild) {
            array = array.concat(this._getPathRoute(route.firstChild));
        }
        return array;
    }

}
