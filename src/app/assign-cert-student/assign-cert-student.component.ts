import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AccountService, InstitutionService} from '../_services';
import {Certificate, Institution, Student} from '../_models';
import {CertificateService} from '../_services/certificate.service';

@Component({
  selector: 'app-assign-cert-student',
  templateUrl: './assign-cert-student.component.html',
  styleUrls: ['./assign-cert-student.component.scss']
})
export class AssignCertStudentComponent implements OnInit {
  dialogTitle: string;
  confirm: string;
  dismiss: string;
  selectedCertificate;
  selectedInstitution;
  columnDefinitions = [
    { def: 'id', hide: false },
    { def: 'name', hide: false },
    { def: 'email', hide: false },
    { def: 'status', hide: false },

  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    public dialogRef: MatDialogRef<AssignCertStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignCertStudentModel,
    private toastr: ToastrService,
    private accountService: AccountService,
    private institutionService: InstitutionService,
    private certificateService: CertificateService

  ) {
    this.selectedCertificate = data.selectedCertificate;
    this.selectedInstitution = new Institution();
    this.selectedInstitution.id = this.selectedCertificate.institutionId;
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

    this.accountService.searchStudents(this.selectedInstitution,this.selectedCertificate).subscribe(
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

  assignStudentToCertificate(element: Student) {
    this.certificateService.update(this.selectedCertificate.id, {accountId: element.id},null).subscribe(
      (data) => {
        this.toastr.success('Success', 'Student Assigned');
        this.onSearch();
      },
      (err) => {
        this.toastr.error('Error', err);

      },
      () => {

      }
    );
  }
  unassignStudentFromCertificate() {
    this.certificateService.update(this.selectedCertificate.id, {accountId: 0},null).subscribe(
      (data) => {
        this.toastr.success('Success', 'Student Unassigned');
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

export class AssignCertStudentModel {
  constructor(
    public dialogTitle: string,
    public item: any = [],
    public actionType: string = 'create',
    public buttonConfirm: string = 'Save',
    public buttonDismiss: string = 'Cancel',
    public selectedCertificate: Certificate = null

  ) {
  }
}
