import {Component, Inject, Injector, OnInit} from "@angular/core";
import {BaseComponent} from "../../../../base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {URLS} from "../../../../../app/app.urls";
import {Cupcake} from "../../../../../models/account/cupcake";
import {CustomValidators} from "../../../../../utilities/validator/custom-validators";
import {environment} from "../../../../../../environments/environment";
import {CupcakeService} from "../../../../../services/cupcake.service";


@Component({
    selector: "app-add-cupcake-dialog",
    templateUrl: "./add-cupcake-dialog.component.html",
    styleUrls: ["./add-cupcake-dialog.component.scss"]
})
export class AddCupcakeDialogComponent extends BaseComponent<Cupcake> implements OnInit {

    public object: Cupcake = new Cupcake();
    private readonly urlBase: string;
    private readonly urlCupcake: string;
    selectedFile: File | null = null;

    constructor(public dialogRef: MatDialogRef<AddCupcakeDialogComponent>, private cupcakeService: CupcakeService,
                public injector: Injector, @Inject(MAT_DIALOG_DATA) public data: any) {
        super(injector, {endpoint: URLS.CUPCAKE});
        this.urlBase = environment.urlBase;
        this.urlCupcake = `${this.urlBase}${URLS.CUPCAKE}`;
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null, CustomValidators.required],
            price: [null, CustomValidators.required],
            image_url: [null]
        });
    }

    public onFileSelected(event: Event): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    public close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (!this.formGroup.valid || !this.selectedFile) {
            return;
        }
        const formData = new FormData();
        formData.append('name', this.formGroup.get('name')?.value);
        formData.append('price', this.formGroup.get('price')?.value);
        formData.append('image', this.selectedFile);

        this.http.post('http://localhost:8000/cupcakes', formData).subscribe({
            next: () => {
                this.toast.success("Sucesso", "Cupcake adicionado com sucesso!");
                this.cupcakeService.triggerRefreshList();
                this.dialogRef.close(true);
            },
            error: (error) => {
                console.error('Erro ao criar cupcake:', error);
            }
        });

    }
}
