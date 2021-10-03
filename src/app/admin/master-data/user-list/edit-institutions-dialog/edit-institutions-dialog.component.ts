import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AddUserDialogModel} from '../add-user-dialog/add-user-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {AccountService, InstitutionService} from '../../../../_services';
import {map, startWith} from 'rxjs/operators';
import {Institution} from '../../../../_models';
export interface DialogData {
  userRole;
}
@Component({
  selector: 'app-edit-institutions-dialog',
  templateUrl: './edit-institutions-dialog.component.html',
  styleUrls: ['./edit-institutions-dialog.component.scss']
})
export class EditInstitutionsDialogComponent implements OnInit {
  title: string;
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  currentAccount;
  columnDefinitions = [
    { def: 'roleName', hide: false },
    { def: 'assignedInstitutions', hide: false },
  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    public dialogRef: MatDialogRef<EditInstitutionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditInstitutionsDialogModel,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private accountService: AccountService

  ) {
    this.dialogTitle = data.dialogTitle;
    this.confirm = data.buttonConfirm;
    this.dismiss = data.buttonDismiss;
    this.title = this.dialogTitle;
    this.currentAccount = data.item;
  }

  ngOnInit(): void {
    this.getCurrentUserRoles(true);

  }
  onDismiss(): void {
    this.dialogRef.close({
      submit: false
    });
  }
  getCurrentUserRoles(isLoadingResults) {
    this.isLoadingResults = isLoadingResults
    this.noResult = false
    this.accountService.getUserRoles(this.currentAccount.id).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.isLoadingResults = false
        this.noResult = data.length > 0 ? false : true
      },
      (err) => {
        this.noResult = true
        console.log(err)
      },
      () => {

      }
    );
  }


  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  openDialog(userRole): void {
    const dialogRef = this.dialog.open(AssignInstitutionsDialogComponent, {
      width: '250px',
      data: {userRole}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);

    });
  }

}

export class EditInstitutionsDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel'
  ) {
  }
}

class Plant {
}

@Component({
  selector: 'app-assign-institutions-dialog',
  templateUrl: 'assign-institutions-dialog.component.html',
})
export class AssignInstitutionsDialogComponent {
  userRole;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  institutions = [];
  allInstitutions = [];
  filteredInstitutions: Observable<Institution[]>;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    public dialogRef: MatDialogRef<AssignInstitutionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private institutionService: InstitutionService,
    private accountService: AccountService,
    private toastr: ToastrService) {
    this.userRole = data.userRole;
    this.institutionService.getAll().subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (data) => {
        if (data) {
          this.allInstitutions = data;
          this.filteredInstitutions = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((plant: any | null) => plant ? this._filter(plant) : this.allInstitutions.slice()));
        }
      },
      (err) => {

      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: any): void {
    const input = event.input;
    const value = event.value;
    const plantObj = {
      id: event.value.id,
      name: event.value.name
    }

    // Add our fruit
    if ((value || '').trim()) {
      this.userRole.institutions.push(plantObj);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit): void {
    const index = this.institutions.indexOf(fruit);
    for (let i = 0; i < this.userRole.institutions.length; i++) {
      if (this.userRole.institutions[i].id === fruit.id) {
        this.userRole.institutions.splice(i, 1);
        this.updateRolePlants();
        break;
      }
    }


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const plantObj = {
      id: event.option.value.id,
      name: event.option.value.name
    }
    this.userRole.institutions.push(plantObj);
    this.updateRolePlants();
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: any): Plant[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();

      return this.allInstitutions.filter(plant => plant.name.toLowerCase().indexOf(filterValue) === 0);
    }

  }

  updateRolePlants() {
    const updatePlants = [];
    this.userRole.institutions.forEach(plant => {
      // const plantObj = {
      //   id: plant.id
      // }
      updatePlants.push(plant.id)
    });
    const updateObj = {
      accountId: this.userRole.accountId,
      institutionIds: updatePlants,
    }
    this.accountService.updateRoleInstitutions(updateObj).subscribe(
      (data) => {
        this.toastr.success('Institutions successfully updated');
      },
      (err) => {
        this.toastr.error('Institutions update error', err);

      },
      () => {

      }
    );
  }

}
