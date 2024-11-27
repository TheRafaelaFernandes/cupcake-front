import {Directive, ElementRef, Host, Input, OnDestroy, OnInit} from "@angular/core";
import {AbstractControlDirective, NgControl} from "@angular/forms";
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs/operators";
import {MatFormField} from "@angular/material/form-field";

@Directive({
    /* tslint:disable: no-use-before-declare */
    selector: `[validator]`,
    exportAs: "validator",
})
export class ValidatorDirective implements OnInit, OnDestroy {

    private unsubscribe = new Subject<void>();

    @Input() source: string | undefined;
    @Input() target: string | undefined;
    @Input() errors: any = {};

    public control: NgControl | AbstractControlDirective | undefined | null;

    constructor(public element: ElementRef,
                @Host() public formField: MatFormField) {
    }

    public ngOnInit() {
        setTimeout(() => {
            this.control = this.formField._control ? this.formField._control.ngControl : null;
            if (this.control) {
                this.onStatusChange();
            }
        }, 0);
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    public onStatusChange(): void {
        this.element.nativeElement.textContent = this.getError("required");

        this.control.statusChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(value => {
                if (value === "INVALID") {
                    this.element.nativeElement.textContent = this.errorMessage;
                }
            });
    }

    public getError(key: string): string {
        try {
            return this.errors[key] ? this.errors[key] : key;
        } catch (e) {
            return key;
        }
    }

    get errorMessage(): string {
        if (this.control && this.control.errors) {
            const key = Object.keys(this.control.errors).pop();
            const replacer = (t: string) => "-" + t.toLowerCase();
            const translate = key.replace(/[A-Z]/g, replacer);
            let str = this.getError(translate);

            if (this.source) {
                str = str.replace("${source}", this.source.toString().toLowerCase());
            }
            if (this.target) {
                str = str.replace("${target}", this.target.toString().toLowerCase());
            }
            return str;
        }
    }
}
