import {Component, OnInit} from "@angular/core";
import {take} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {URLS} from "../../../app/app.urls";
import {environment} from "../../../../environments/environment";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../services/auth.service";
import {CupcakeService} from "../../../services/cupcake.service";

export interface Cupcake {
    id: number;
    name: string;
    price: number;
}

@Component({
    selector: "app-page-notfound",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit{

    private readonly urlFavoriteCupcake: string;
    private readonly urlCupcake: string;
    private readonly urlBase: string;
    public cupcakesList: any;
    public storage = localStorage;
    public user: string;

    constructor(public http: HttpClient, private cupcakeService: CupcakeService, public toast: ToastrService, public authService: AuthService,) {
        this.urlBase = environment.urlBase;
        this.urlCupcake = `${this.urlBase}${URLS.CUPCAKE}`;
        this.urlFavoriteCupcake = `${this.urlBase}${URLS.FAVORITE_CUPCAKE}`;
    }

    public ngOnInit() {
        this.user = this.authService.user;
        this.getCupcake();
        this.cupcakeService.refreshList$.subscribe(() => {
            this.getCupcake();
        });
    }

    public getCupcake(): void {
        let params = new HttpParams;
        if (this.authService.user?.["id"]) {
            params = params.set('customer_id', this.user?.["id"].toString());
        }
        this.http.get(this.urlCupcake, { params })
            .pipe(take(1))
            .subscribe((cupcakes) => {
                this.cupcakesList = cupcakes;
            });
    }

    public addToCart(cupcake: Cupcake): void {
        const cart = JSON.parse(this.storage.getItem("cart") || "[]");
        cart.push(cupcake);
        this.storage.setItem("cart", JSON.stringify(cart));
        this.toast.success("Cupcake adicionado com sucesso", "Sucesso");
    }

    public addFavorite(cupcake: any, isFavorite): void {
        const payload = {
            customer_id: this.authService.user?.["id"],
            cupcake_id: cupcake.id
        };
        this.http.post(this.urlFavoriteCupcake, payload).subscribe({
            next: () => {
                cupcake.is_favorite = !isFavorite;
                !isFavorite ?
                    this.toast.success("Cupcake adicionado com sucesso", "Sucesso"):
                    this.toast.success("Cupcake removido com sucesso", "Sucesso");
            },
            error: (err) => console.error('Erro ao adicionar aos favoritos', err)
        });
    }

    public deleteCupcake(cupcake: any): void {
        const payload = { cupcake_id: cupcake.id };

        this.http.post(`${this.urlCupcake}/inactivate`, payload).subscribe({
            next: () => {
                this.toast.success("Cupcake deletado com sucesso", "Sucesso");
                this.getCupcake();
            },
            error: (err) => console.error('Erro ao deletar cupcake', err)
        });
    }


}
