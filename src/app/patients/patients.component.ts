import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { PatientModel } from '../models/PatientModel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  constructor(
    private service: DataserviceService,
    private route: ActivatedRoute
  ) {}
  patientArr$: PatientModel[] = null;
  selectedPatient: PatientModel = new PatientModel(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  inputId: string;

  ngOnInit() {
    this.getPatients();
    this.selectedPatient.id = this.route.snapshot.paramMap.get('id');
  }
  getPatients() {
    this.service.getPatients().subscribe((data: PatientModel[]) => {
      console.log(data);
      this.patientArr$ = data;
    });
  }

  //Wird aufgerufen, wenn ein Patient in der Liste angeklickt wird
  selectPatient(selected: PatientModel) {
    console.log('clicked Patient' + selected.id);
    this.selectedPatient = selected;
  }

  //Wird von der Patient Component aufgerufen, wenn sich die Liste aktualisieren soll
  onPatientModified(hidePatient: boolean) {
    console.log('Patient modified ' + hidePatient);
    if (hidePatient) {
      this.selectedPatient = null;
    }
    this.getPatients();
  }

  createPatient() {
    var newPatient: PatientModel = new PatientModel(
      null,
      null,
      null,
      null,
      true,
      'unknown',
      null,
      false,
      null,
      false,
      null
    );

    this.service.addPatient(newPatient).subscribe(patient => {
      console.log('Patient created');
      this.onPatientModified(true);
    });
  }
}
