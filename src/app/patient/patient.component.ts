import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { DataserviceService } from "../dataservice.service";
import { PatientModel, HumanName } from "../models/PatientModel";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-patient",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit, OnChanges {
  //FormBuilder wird verwendet, um einfach Formulare für die Benutzereingabe zu bauen
  constructor(
    private service: DataserviceService,
    private formBuilder: FormBuilder
  ) {
    this.createPatientForm();
  }

  //Input parameter from patient list, which patient details should be displayed
  @Input()
  id: string = "";

  //Notify the parent View to refresh the list
  @Output()
  patientModified = new EventEmitter<boolean>();

  //Das Datenmodell für die Anzeige
  public patient: PatientModel = null;

  //Die Formulardaten, das wird auch im html verwendet
  public patientForm: FormGroup;

  ngOnInit(): void {
    //this.getPatient();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getPatient();
  }

  //_____ Begin Formular

  //Methoden, um auf das namen Array zugreifen zu können
  get namesArray() {
    return this.patientForm.get("name") as FormArray;
  }
  set namesArray(namesArray: FormArray) {
    this.patientForm.controls.name = namesArray;
  }

  //Die Formularstruktur erstellen
  createPatientForm() {
    this.patientForm = this.formBuilder.group({
      active: [""],
      gender: ["unknown"],
      deceasedBoolean: [""],
      deceasedDateTime: [""],
      birthDate: [""],
      name: this.formBuilder.array([]),
    });
  }

  //Wenn ein Patient vom Server geladen wurde, sollen die Patientendaten in das Formular übernommen werden.
  updatePatientForm() {
    this.patientForm.controls.active.setValue(this.patient.active);
    this.patientForm.controls.gender.setValue(this.patient.gender);
    this.patientForm.controls.deceasedDateTime.setValue(this.patient.deceasedDateTime);
    this.patientForm.controls.deceasedBoolean.setValue(this.patient.deceasedBoolean);
    this.patientForm.controls.birthDate.setValue(this.patient.birthDate);

    this.clearFormArray(this.namesArray);
    
    this.patient.name.forEach((name) => {
      console.log("push name" + name.family);
      this.namesArray.push(
        this.formBuilder.group({
          id: [name.id],
          text: [name.text],
          use: [name.use],
          family: [name.family],
        })
      );
    });
  }
  //Einen Namen hinzufügen
  public addName() {
    this.namesArray.push(this.createName());
  }
  createName(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      use: ["official"],
      text: [""],
      family: [""],
    });
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  //Formular wird abgeschickt
  onSubmitUpdate() {
    console.log("Update from form data" + this.patientForm.value);
    this.patient.active = this.patientForm.value.active;
    this.patient.gender = this.patientForm.value.gender;
    this.patient.birthDate = this.patientForm.value.birthDate;
    this.patient.deceasedDateTime = this.patientForm.value.deceasedDateTime;
    this.patient.deceasedBoolean = this.patientForm.value.deceasedBoolean;
    this.patient.name = this.patientForm.value.name;
    this.updatePatient();
  }
  //_____ End Formular

  //_____ Begin Methods to interact with Service _____
  getPatient() {
    this.service.getPatient(this.id).subscribe((data: PatientModel) => {
      console.log(data);
      this.patient = data;
      this.updatePatientForm();
    });
  }

  deletePatient() {
    this.service
      .deletePatient(this.patient.id)
      .subscribe((x) => this.patientModified.emit(true));
  }

  updatePatient() {
    var newPatient: PatientModel = this.patient;
    this.service.updatePatient(newPatient).subscribe((patient) => {
      console.log("Patient updated");
      this.patient = patient;
      this.patientModified.emit(false);
    });
  }
  //_____ End Methods to interact with Service _____
}
