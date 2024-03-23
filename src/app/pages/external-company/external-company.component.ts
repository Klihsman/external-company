import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import ExternalCompany from 'src/app/models/external-company';
import { ExternalCompanyService } from 'src/app/services/external-company.service';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-external-company',
  templateUrl: './external-company.component.html',
  styleUrls: ['./external-company.component.scss'],
})
export class ExternalCompanyComponent implements OnInit {
  displayedColumns: string[] = [
    'createdAt',
    'companyName',
    'collaboratorsCount',
    ' ',
  ];
  dataSource = new MatTableDataSource<ExternalCompany>();
  currentPage: number = 0;
  currentUrl: string = '';

  constructor(
    private externalCompanyService: ExternalCompanyService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'];
      if (page) {
        this.currentPage = +page;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.pageIndex = this.currentPage;
        }
      }
    });

    this.currentUrl = window.location.href;

    this.externalCompanyService.ExternalCompaniesList().subscribe((data) => {
      this.dataSource.data = data.body || [];
    });
  }

  openDeleteDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element: ExternalCompany
  ): void {
    this.dialog.open(DialogDelete, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: element,
    });
  }

  openRegisterExternalCompanyDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(DialogRegisterExternalCompany, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openEditExternalCompanyDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element: ExternalCompany
  ): void {
    this.dialog.open(DialogEditExternalCompany, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: element,
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updateQueryParam('page', this.currentPage);
  }

  private updateQueryParam(param: string, value: any) {
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams[param] = value;
    this.router.navigate([], { queryParams });
    this.currentUrl = this.getCurrentUrlWithParams();
  }

  copyUrlToClipboard() {
    this.currentUrl = this.getCurrentUrlWithParams();
    const el = document.createElement('textarea');
    el.value = this.currentUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  private getCurrentUrlWithParams(): string {
    const baseUrl = window.location.origin + window.location.pathname;
    const queryParams = this.route.snapshot.queryParams;
    const queryParamsString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');
    return `${baseUrl}?${queryParamsString}`;
  }
}

@Component({
  selector: 'dialog-delete-modal',
  templateUrl: 'dialog-delete-modal.html',
  standalone: true,
  imports: [MaterialModule],
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: ExternalCompany,
    private externalCompanyService: ExternalCompanyService
  ) {}

  delete() {
    if (this.data.id) {
      this.externalCompanyService
        .DeleteExternalCompany(this.data.id)
        .subscribe(() => {
          console.log('Usuário deletado com sucesso');
        });
    }
  }
}

@Component({
  selector: 'dialog-register-external-company',
  templateUrl: 'dialog-register-external-company.html',
  standalone: true,
  imports: [MaterialModule, FormsModule],
})
export class DialogRegisterExternalCompany {
  name: string = '';
  collaboratorsCount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogRegisterExternalCompany>,
    @Inject(MAT_DIALOG_DATA) public data: ExternalCompany,
    private externalCompanyService: ExternalCompanyService
  ) {}

  register() {
    this.externalCompanyService
      .RegisterExternalCompany({
        companyName: this.name,
        collaboratorsCount: this.collaboratorsCount,
      })
      .subscribe(() => {
        console.log('Usuário cadastrado com sucesso');
      });
  }
}
@Component({
  selector: 'dialog-edit-external-company',
  templateUrl: 'dialog-edit-external-company.html',
  standalone: true,
  imports: [MaterialModule, FormsModule],
})
export class DialogEditExternalCompany {
  name: string = this.data.companyName;
  collaboratorsCount: number = this.data.collaboratorsCount;

  constructor(
    public dialogRef: MatDialogRef<DialogEditExternalCompany>,
    @Inject(MAT_DIALOG_DATA) public data: ExternalCompany,
    private externalCompanyService: ExternalCompanyService
  ) {}

  update() {
    this.externalCompanyService
      .UpdateExternalCompany({
        companyName: this.name,
        collaboratorsCount: this.collaboratorsCount,
        id: this.data.id,
      })
      .subscribe(() => {
        console.log('Usuário atualizazdo com sucesso');
      });
  }
}
