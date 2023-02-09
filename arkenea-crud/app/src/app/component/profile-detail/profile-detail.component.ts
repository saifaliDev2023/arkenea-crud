import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: number,
  profile_image: string
}


@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})

export class ProfileDetailComponent {
  constructor(
    // public dialogRef: MatDialogRef<ProfileDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      first_name: string,
      last_name: string,
      email: string,
      phone_number: number,
      profile_image: string
    },
  ) { }
}
