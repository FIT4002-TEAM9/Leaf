import { PatientEventCategory } from "../src/model/patient/PatientEventCategory";
import { strings } from "../src/localisation/Strings";

describe('PatientEventCategory', () => {
  it('should create a new PatientEventCategory instance', () => {
    const medicationCategory = new PatientEventCategory('MEDICATION');
    expect(medicationCategory).toBeInstanceOf(PatientEventCategory);
    expect(medicationCategory.id).toBe('MEDICATION');
  });

  it('should check if two PatientEventCategory instances match', () => {
    const category1 = new PatientEventCategory('MEDICATION');
    const category2 = new PatientEventCategory('MEDICATION');
    const category3 = new PatientEventCategory('OTHER');

    expect(category1.matches(category2)).toBe(true);
    expect(category1.matches(category3)).toBe(false);
  });

  it('should convert PatientEventCategory to string', () => {
    const medicationCategory = new PatientEventCategory('MEDICATION');
    const otherCategory = new PatientEventCategory('OTHER');

    expect(medicationCategory.toString()).toBe(strings('patientEventCategory.medication'));
    expect(otherCategory.toString()).toBe(strings('patientEventCategory.other'));

    // Unknown category should fallback to the "unknown" string
    const unknownCategory = new PatientEventCategory('UNKNOWN_CATEGORY');
    expect(unknownCategory.toString()).toBe(strings('unknown'));
  });
});
