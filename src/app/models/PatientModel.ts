export class PatientModel 
{ 
    constructor(
        public id: string, 
        public resourceType: string, 
        public name: [HumanName ], 
        public telecom: [ ContactPoint ], 
        public active: boolean, 
        public gender: string, 
        public birthDate: Date, 
        public deceasedBoolean: boolean, 
        public deceasedDateTime: Date, 
        public multipleBirthBoolean: boolean, 
        public multipleBirthInteger: number,

        ) { } 
        

    } 
    
    export class HumanName{
        public id: string = ''
            public use: string = ''
            public text: string = ''
            public family: string = ''
        constructor(
            id: string = '',
            use: string = '',
            text: string = '',
            family: string = ''
        ){this.id=id;this.use=use;this.family=family; this.text=text}
    } 
    
    export class ContactPoint { 
        constructor() { } 
    }