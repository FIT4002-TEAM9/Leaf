import { PatientSex } from "../src/model/patient/PatientSex";
import { strings } from "../src/localisation/Strings";

describe('PatientSex', () => {
  it('should match patient sex correctly', () => {
    const male1 = PatientSex.male;
    const male2 = new PatientSex("MALE");
    const female = PatientSex.female;
    const other = PatientSex.other;

    expect(male1.matches(male2)).toBe(true);
    expect(male1.matches(female)).toBe(false);
    expect(male1.matches(other)).toBe(false);

    expect(female.matches(male1)).toBe(false);
    expect(female.matches(female)).toBe(true);
    expect(female.matches(other)).toBe(false);

    expect(other.matches(male1)).toBe(false);
    expect(other.matches(female)).toBe(false);
    expect(other.matches(other)).toBe(true);
  });

  it('should convert to string correctly', () => {
    const male = PatientSex.male;
    const female = PatientSex.female;
    const other = PatientSex.other;

    expect(male.toString()).toBe(strings("sex.male"));
    expect(female.toString()).toBe(strings("sex.female")); 
    expect(other.toString()).toBe(strings("sex.other")); 
  });

  it('should handle unknown sex', () => {
    const unknown = new PatientSex("UNKNOWN");

    expect(unknown.toString()).toBe(strings("unknown"));
  });

});
