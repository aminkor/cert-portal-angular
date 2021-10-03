import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InstitutionService} from '../../../_services';
import {Institution} from '../../../_models';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {
  AddInstitutionDialogComponent,
  AddInstitutionDialogModel
} from '../institution-list/add-institution-dialog/add-institution-dialog.component';
import {AddStudentDialogComponent, AddStudentDialogModel} from './add-student-dialog/add-student-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {error} from 'protractor';
import {Student} from '../../../_models/student';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  selectedInstitutionId;
  selectedInstitution: Institution;

  columnDefinitions = [
    { def: 'id', hide: false },
    { def: 'name', hide: false },
    { def: 'created', hide: false },
    { def: 'updated', hide: false },
    { def: 'remove', hide: false },

  ]

  isLoadingResults = false
  noResult = false
  pageSize = 100

  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private institutionService: InstitutionService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const paramsInstitutionId = this.route.snapshot.queryParamMap.get('institutionId');
    if (paramsInstitutionId) {
      this.getInstitution(paramsInstitutionId);
    }

  }

  close() {
    this.router.navigate(['admin/institution-list'])
  }

  private getInstitution(paramsInstitutionId) {
    this.institutionService.getById(paramsInstitutionId).subscribe(
      (data) => {
        if (data) {
          this.selectedInstitution = data;
          this.onSearch()

        }
      },
      (err) => {
        console.log(err);
      },
      () => {

      }
    );
  }

  onSearch() {
    this.dataSource = new MatTableDataSource([])
    this.getUserMasterData()
  }

  getUserMasterData() {
    this.isLoadingResults = true
    this.noResult = false

    this.institutionService.getStudents(this.selectedInstitution).subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.isLoadingResults = false
        this.noResult = data.length > 0 ? false : true
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        this.noResult = true
        console.log(error)
      }
    )
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def)
  }

  addNewStudent() {
    const title = `Add Student`,
      dialogData = new AddStudentDialogModel(title,[],'create','Save','Cancel', this.selectedInstitution),
      dialogRef = this.dialog.open(AddStudentDialogComponent, {
        maxWidth: '500px',
        width: '500px',
        data: dialogData,
        disableClose: true
      })

    dialogRef.afterClosed().subscribe(
      dialogResult => {
        this.onSearch();
      }
    );
  }

  removeStudent(student: Student) {
    this.institutionService.removeStudent(student, this.selectedInstitution).subscribe(
      (data) => {
        this.toastr.success('Success', 'Removed student' + student.firstName + ' ' + student.lastName);
        this.onSearch();

      }, (err) => {
        this.toastr.error('Error', 'Fail to remove student' + student.firstName + ' ' + student.lastName);

      }, () => {}
    );
  }
}
