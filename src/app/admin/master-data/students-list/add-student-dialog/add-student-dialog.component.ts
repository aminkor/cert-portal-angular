import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Institution} from '../../../../_models';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AccountService, InstitutionService} from '../../../../_services';
import {Student} from '../../../../_models/student';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.scss']
})
export class AddStudentDialogComponent implements OnInit {
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  selectedInstitution;
  columnDefinitions = [
    { def: 'name', hide: false },
    { def: 'status', hide: false },

  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddStudentDialogModel,
    private toastr: ToastrService,
    private accountService: AccountService,
    private institutionService: InstitutionService

  ) {
    this.selectedInstitution = data.selectedInstitution;
  }

  ngOnInit(): void {
    this.onSearch();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  onSearch() {
    this.dataSource = new MatTableDataSource([])
    this.getUserMasterData()
  }

  getUserMasterData() {
    this.isLoadingResults = true
    this.noResult = false

    this.accountService.searchStudents(this.selectedInstitution).subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.isLoadingResults = false
        this.noResult = data.length > 0 ? false : true
      },
      error => {
        this.noResult = true
        console.log(error)
      }
    )
  }


  onDismiss(): void {
    this.dialogRef.close({
      submit: false
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  addStudentToInstitution(element: Student) {
    this.institutionService.addStudent(element, this.selectedInstitution).subscribe(
      (data) => {
        this.toastr.success('Success', 'Student Added');
        this.onSearch();
      },
      (err) => {
        this.toastr.error('Error', err);

      },
      () => {

      }
    );
  }
}

export class AddStudentDialogModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel',
    public selectedInstitution: Institution = null
  ) {
  }
}
