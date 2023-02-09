import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  selectedFile: any;

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private sanitizer: DomSanitizer
  ) {
    this.empForm = this._fb.group({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      // profile_image: ''
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  onChangeImage(e: any) {
    this.selectedFile = e.target.files[0];
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        
        this.empForm.value.phone_number = this.empForm.value.phone_number.toString();
        this._empService
          .updateEmployee(this.data._id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Record detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this.empForm.value.phone_number = this.empForm.value.phone_number.toString();

        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Record added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

}
