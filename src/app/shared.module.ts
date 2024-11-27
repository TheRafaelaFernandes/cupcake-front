import {ModuleWithProviders, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatDatepickerIntl} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AuthService} from "./services/auth.service";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTabsModule} from "@angular/material/tabs";
import {ValidatorDirective} from "./utilities/validator/validator.directive";
import {NgPipesModule} from "ngx-pipes";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FxFlexDirective} from "../assets/fx/fx-flex.directive";
import {FxLayoutDirective} from "../assets/fx/fx-layout.directive";
import {FxLayoutGapDirective} from "../assets/fx/fx-layout-gap.directive";
import {FxLayoutAlignDirective} from "../assets/fx/fx-layout-align.directive";
import {FxFillDirective} from "../assets/fx/fx-fill.directive";
import {FxGridDirective} from "../assets/fx/fx-grid.directive";
import {FxGridGapDirective} from "../assets/fx/fx-grid-gap.directive";

@NgModule({
    declarations: [
        ValidatorDirective,
        FxFlexDirective,
        FxLayoutDirective,
        FxLayoutGapDirective,
        FxLayoutAlignDirective,
        FxFillDirective,
        FxGridDirective,
        FxGridGapDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgPipesModule,
        MatListModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatTabsModule,
        MatDividerModule,
        MatToolbarModule,
    ],
    exports: [
        ValidatorDirective,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgPipesModule,
        MatListModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatTabsModule,
        MatDividerModule,
        MatToolbarModule,
        MatChipsModule,
        MatButtonToggleModule,
        FxFlexDirective,
        FxLayoutDirective,
        FxLayoutGapDirective,
        FxLayoutAlignDirective,
        FxFillDirective,
        FxGridDirective,
        FxGridGapDirective,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AuthService,
                MatDatepickerIntl,
            ]
        };
    }
}
