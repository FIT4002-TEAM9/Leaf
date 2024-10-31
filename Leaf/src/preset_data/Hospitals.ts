import Hospital from "../model/hospital/Hospital";
import Ward from "../model/hospital/Ward";
import MedicalUnit from "../model/hospital/MedicalUnit";

const hospitalA = new Hospital("H1", "STA", "St Care A");
// add hospital A wards
hospitalA.addWard("W1", new Ward("W1", "STA", "EMER STA"));
hospitalA.addWard("W2", new Ward("W2", "STA", "SSU STA"));
hospitalA.addWard("W3", new Ward("W3", "STA", "CDU STA"));
hospitalA.addWard("W4", new Ward("W4", "STA", "2E STA"));
hospitalA.addWard("W5", new Ward("W5", "STA", "SSUP STA"));
hospitalA.addWard("W6", new Ward("W6", "STA", "1 WEST STA"));
hospitalA.addWard("W7", new Ward("W7", "STA", "CDUP STA"));
hospitalA.addWard("W8", new Ward("W8", "STA", "4E STA"));
hospitalA.addWard("W9", new Ward("W9", "STA", "2 WEST STA"));
hospitalA.addWard("W10", new Ward("W10", "STA", "1 NORTH STA"));
hospitalA.addWard("W11", new Ward("W11", "STA", "TL STA"));
hospitalA.addWard("W12", new Ward("W12", "STA", "3E STA"));
// add hospital A medical units
hospitalA.addMedUnit("M1", new MedicalUnit("M1", "Gynaecology STA", "Women & Children"));
hospitalA.addMedUnit("M2", new MedicalUnit("M2", "Obstetrics STA", "Women & Children"));
hospitalA.addMedUnit("M3", new MedicalUnit("M3", "Acute Care OP STA", "Emergency and General Medicine"));
hospitalA.addMedUnit("M4", new MedicalUnit("M4", "Clinical Decision Unit STA", "Emergency and General Medicine"));
hospitalA.addMedUnit("M5", new MedicalUnit("M5", "Acute Medical A1 STA", "Emergency and General Medicine"));
hospitalA.addMedUnit("M6", new MedicalUnit("M6", "Paediatrics STA", "Women & Children"));
hospitalA.addMedUnit("M7", new MedicalUnit("M7", "Short Stay Unit STA", "Emergency and General Medicine"));
hospitalA.addMedUnit("M8", new MedicalUnit("M8", "Gen Surg STA", "Surgery"));
hospitalA.addMedUnit("M9", new MedicalUnit("M9", "GEM 1W STA", "Continuing Care"));

const hospitalB = new Hospital("H2", "STB", "St Care B");
// add hospital B wards
hospitalB.addWard("W1", new Ward("W1", "STB", "Emergency STB"));
hospitalB.addWard("W2", new Ward("W2", "STB", "4.1 STB"));
hospitalB.addWard("W3", new Ward("W3", "STB", "ADOL IPU STB"));
hospitalB.addWard("W4", new Ward("W4", "STB", "3.4 STB"));
hospitalB.addWard("W5", new Ward("W5", "STB", "2.2 STB"));
hospitalB.addWard("W6", new Ward("W6", "STB", "3.1 STB"));
hospitalB.addWard("W7", new Ward("W7", "STB", "9.2 STB"));
hospitalB.addWard("W8", new Ward("W8", "STB", "8.1 STB"));
hospitalB.addWard("W9", new Ward("W9", "STB", "6.2 STB"));
hospitalB.addWard("W10", new Ward("W10", "STB", "7.1 STB"));
hospitalB.addWard("W11", new Ward("W11", "STB", "2.1 STB"));
hospitalB.addWard("W12", new Ward("W12", "STB", "5.1 STB"));
hospitalB.addWard("W13", new Ward("W13", "STB", "7.2 STB"));
hospitalB.addWard("W14", new Ward("W14", "STB", "CDU STB"));
hospitalB.addWard("W15", new Ward("W15", "STB", "6.1 STB"));
hospitalB.addWard("W16", new Ward("W16", "STB", "SSU STB"));
hospitalB.addWard("W17", new Ward("W17", "STB", "9.1 STB"));
hospitalB.addWard("W18", new Ward("W18", "STB", "5.3 STB"));
hospitalB.addWard("W19", new Ward("W19", "STB", "8.2 STB"));
hospitalB.addWard("W20", new Ward("W20", "STB", "UPT HOUSE STB"));
hospitalB.addWard("W21", new Ward("W21", "STB", "3.3 STB"));
hospitalB.addWard("W22", new Ward("W22", "STB", "HITH STB"));
hospitalB.addWard("W23", new Ward("W23", "STB", "Surg Admit STB"));
hospitalB.addWard("W24", new Ward("W24", "STB", "5.2 STB"));
hospitalB.addWard("W25", new Ward("W25", "STB", "Emergency Admissions STB"));
hospitalB.addWard("W26", new Ward("W26", "STB", "2.3 STB"));
hospitalB.addWard("W27", new Ward("W27", "STB", "4.3 STB"));

// add hospital B medical units
hospitalB.addMedUnit("M1", new MedicalUnit("M1", "Short Stay Unit MA STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M2", new MedicalUnit("M2", "Renal Dialysis PJ STB", "Speciality Medicine"));
hospitalB.addMedUnit("M3", new MedicalUnit("M3", "Haemostasis - Thrombosis STB", "Speciality Medicine"));
hospitalB.addMedUnit("M4", new MedicalUnit("M4", "Rheumatology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M5", new MedicalUnit("M5", "Maternity STB", "Women & Children"));
hospitalB.addMedUnit("M6", new MedicalUnit("M6", "Oncology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M7", new MedicalUnit("M7", "COVID1 suspected STB", "Speciality Medicine"));
hospitalB.addMedUnit("M8", new MedicalUnit("M8", "ENT STB", "Surgery"));
hospitalB.addMedUnit("M9", new MedicalUnit("M9", "Clinical Decision Unit STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M10", new MedicalUnit("M10", "Psych - Adult STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit("M11", new MedicalUnit("M11", "Orthopaedic Surgery 2 STB", "Surgery"));
hospitalB.addMedUnit("M12", new MedicalUnit("M12", "Neurology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M13", new MedicalUnit("M13", "COVID - HIT STB", "Speciality Medicine"));
hospitalB.addMedUnit("M14", new MedicalUnit("M14", "COVID1 confirmed STB", "Speciality Medicine"));
hospitalB.addMedUnit("M15", new MedicalUnit("M15", "CV-Acute Medical 1 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M16", new MedicalUnit("M16", "Thoracic Surgery STB", "Surgery"));
hospitalB.addMedUnit("M17", new MedicalUnit("M17", "Short Stay Unit STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M18", new MedicalUnit("M18", "HIT STB", "Continuing Care"));
hospitalB.addMedUnit("M19", new MedicalUnit("M19", "Paediatric Surgery STB", "Surgery"));
hospitalB.addMedUnit("M20", new MedicalUnit("M20", "Orthopaedic Surgery 1 STB", "Surgery"));
hospitalB.addMedUnit("M21", new MedicalUnit("M21", "Gen Surg A STB", "Surgery"));
hospitalB.addMedUnit("M22", new MedicalUnit("M22", "Gen Surg D STB", "Surgery"));
hospitalB.addMedUnit("M23", new MedicalUnit("M23", "Obs & Gynae STB", "Women & Children"));
hospitalB.addMedUnit("M24", new MedicalUnit("M24", "Psych - Adult Upton House STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit("M25", new MedicalUnit("M25", "Endocrinology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M26", new MedicalUnit("M26", "Haemostasis/Thromb/Lymphoma STB", "Speciality Medicine"));
hospitalB.addMedUnit("M27", new MedicalUnit("M27", "Vascular Surgery STB", "Surgery"));
hospitalB.addMedUnit("M28", new MedicalUnit("M28", "Plastic Surgery STB", "Surgery"));
hospitalB.addMedUnit("M29", new MedicalUnit("M29", "Urology STB", "Surgery"));
hospitalB.addMedUnit("M30", new MedicalUnit("M30", "Adolescent IPU STB", "Mental Health/Turning Point/Alcohol&Drug"));
hospitalB.addMedUnit("M31", new MedicalUnit("M31", "Acute Medical B2 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M32", new MedicalUnit("M32", "Renal STB", "Speciality Medicine"));
hospitalB.addMedUnit("M33", new MedicalUnit("M33", "Respiratory STB", "Speciality Medicine"));
hospitalB.addMedUnit("M34", new MedicalUnit("M34", "Gastroenterology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M35", new MedicalUnit("M35", "Acute Medical B1 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M36", new MedicalUnit("M36", "Gen Surg C STB", "Surgery"));
hospitalB.addMedUnit("M37", new MedicalUnit("M37", "Gen Surg B STB", "Surgery"));
hospitalB.addMedUnit("M38", new MedicalUnit("M38", "Oncology 4.1 STB", "Speciality Medicine"));
hospitalB.addMedUnit("M39", new MedicalUnit("M39", "Haematology STB", "Speciality Medicine"));
hospitalB.addMedUnit("M40", new MedicalUnit("M40", "Paediatrics STB", "Women & Children"));
hospitalB.addMedUnit("M41", new MedicalUnit("M41", "Oncology 5.1 STB", "Speciality Medicine"));
hospitalB.addMedUnit("M42", new MedicalUnit("M42", "Stroke STB", "Speciality Medicine"));
hospitalB.addMedUnit("M43", new MedicalUnit("M43", "Acute Medical B3 STB", "Emergency and General Medicine"));
hospitalB.addMedUnit("M44", new MedicalUnit("M44", "Cardiology STB", "Speciality Medicine"));

export const HospitalArray = [hospitalA, hospitalB];

export const Hospitals = HospitalArray.reduce(
    (accumulator, hospital) => {
        accumulator[hospital.id] = hospital;
        return accumulator;
    },
    {} as Record<string, Hospital>,
);
