-- Insert Default Hospitals
INSERT INTO
    hospital (id, code, hospital_name)
VALUES
    ('H1', 'STA', 'St Care A'),
    ('H2', 'STB', 'St Care B');

-- Hospital A
---- Insert Default Wards
INSERT INTO
    ward (id, code, ward_name, hospital_id)
VALUES
    ('W1', 'STA', 'EMER STA', 'H1'),
    ('W2', 'STA', 'SSU STA', 'H1'),
    ('W3', 'STA', 'CDU STA', 'H1'),
    ('W4', 'STA', '2E STA', 'H1'),
    ('W5', 'STA', 'SSUP STA', 'H1'),
    ('W6', 'STA', '1 WEST STA', 'H1'),
    ('W7', 'STA', 'CDUP STA', 'H1'),
    ('W8', 'STA', '4E STA', 'H1'),
    ('W9', 'STA', '2 WEST STA', 'H1'),
    ('W10', 'STA', '1 NORTH STA', 'H1'),
    ('W11', 'STA', 'TL STA', 'H1'),
    ('W12', 'STA', '3E STA', 'H1');

---- Insert Default Medical Units
INSERT INTO
    medical_unit (id, unit_group, unit_name, hospital_id)
VALUES
    ('M1', 'Women & Children', 'Gynaecology STA', 'H1'),
    ('M2', 'Women & Children', 'Obstetrics STA', 'H1'),
    ('M3', 'Emergency & General Medicine', 'Acute Care OP STA', 'H1'),
    ('M4', 'Emergency & General Medicine', 'Clinical Decision Unit STA', 'H1'),
    ('M5', 'Emergency & General Medicine', 'Acute Medical A1 STA', 'H1'),
    ('M6', 'Women & Children', 'Paediatrics STA', 'H1'),
    ('M7', 'Emergency & General Medicine', 'Short Stay Unit STA', 'H1'),
    ('M8', 'Surgery', 'Gen Surg STA', 'H1'),
    ('M9', 'Continuing Care', 'GEM 1W STA', 'H1');

-- Hospital B
---- Insert Default Wards
INSERT INTO
    ward (id, code, ward_name, hospital_id)
VALUES
    ('W13', 'STB', 'Emergency STB', 'H2'),
    ('W14', 'STB', '4.1 STB', 'H2'),
    ('W15', 'STB', 'ADOL IPU STB', 'H2'),
    ('W16', 'STB', '3.4 STB', 'H2'),
    ('W17', 'STB', '2.2 STB', 'H2'),
    ('W18', 'STB', '3.1 STB', 'H2'),
    ('W19', 'STB', '9.2 STB', 'H2'),
    ('W20', 'STB', '8.1 STB', 'H2'),
    ('W21', 'STB', '6.2 STB', 'H2'),
    ('W22', 'STB', '7.1 STB', 'H2'),
    ('W23', 'STB', '2.1 STB', 'H2'),
    ('W24', 'STB', '5.1 STB', 'H2'),
    ('W25', 'STB', '7.2 STB', 'H2'),
    ('W26', 'STB', 'CDU STB', 'H2'),
    ('W27', 'STB', '6.1 STB', 'H2'),
    ('W28', 'STB', 'SSU STB', 'H2'),
    ('W29', 'STB', '9.1 STB', 'H2'),
    ('W30', 'STB', '5.3 STB', 'H2'),
    ('W31', 'STB', '8.2 STB', 'H2'),
    ('W32', 'STB', 'UPT HOUSE STB', 'H2'),
    ('W33', 'STB', '3.3 STB', 'H2'),
    ('W34', 'STB', 'HITH STB', 'H2'),
    ('W35', 'STB', 'Surg Admit STB', 'H2'),
    ('W36', 'STB', '5.2 STB', 'H2'),
    ('W37', 'STB', 'Emergency Admissions STB', 'H2'),
    ('W38', 'STB', '2.3 STB', 'H2'),
    ('W39', 'STB', '4.3 STB', 'H2');

---- Insert Default Medical Units
INSERT INTO
    medical_unit (id, unit_group, unit_name, hospital_id)
VALUES
    ('M10', 'Emergency and General Medicine', 'Short Stay Unit MA STB', 'H2'),
    ('M11', 'Speciality Medicine', 'Renal Dialysis PJ STB', 'H2'),
    ('M12', 'Speciality Medicine', 'Haemostasis - Thrombosis STB', 'H2'),
    ('M13', 'Speciality Medicine', 'Rheumatology STB', 'H2'),
    ('M14', 'Women & Children', 'Maternity STB', 'H2'),
    ('M15', 'Speciality Medicine', 'Oncology STB', 'H2'),
    ('M16', 'Speciality Medicine', 'COVID1 suspected STB', 'H2'),
    ('M17', 'Surgery', 'ENT STB', 'H2'),
    ('M18', 'Emergency and General Medicine', 'Clinical Decision Unit STB', 'H2'),
    ('M19', 'Mental Health/Turning Point/Alcohol&Drug', 'Psych - Adult STB', 'H2'),
    ('M20', 'Surgery', 'Orthopaedic Surgery 2 STB', 'H2'),
    ('M21', 'Speciality Medicine', 'Neurology STB', 'H2'),
    ('M22', 'Speciality Medicine', 'COVID - HIT STB', 'H2'),
    ('M23', 'Speciality Medicine', 'COVID1 confirmed STB', 'H2'),
    ('M24', 'Emergency and General Medicine', 'CV-Acute Medical 1 STB', 'H2'),
    ('M25', 'Surgery', 'Thoracic Surgery STB', 'H2'),
    ('M26', 'Emergency and General Medicine', 'Short Stay Unit STB', 'H2'),
    ('M27', 'Continuing Care', 'HIT STB', 'H2'),
    ('M28', 'Surgery', 'Paediatric Surgery STB', 'H2'),
    ('M29', 'Surgery', 'Orthopaedic Surgery 1 STB', 'H2'),
    ('M30', 'Surgery', 'Gen Surg A STB', 'H2'),
    ('M31', 'Surgery', 'Gen Surg D STB', 'H2'),
    ('M32', 'Women & Children', 'Obs & Gynae STB', 'H2'),
    ('M33', 'Mental Health/Turning Point/Alcohol&Drug', 'Psych - Adult Upton House STB', 'H2'),
    ('M34', 'Speciality Medicine', 'Endocrinology STB', 'H2'),
    ('M35', 'Speciality Medicine', 'Haemostasis/Thromb/Lymphoma STB', 'H2'),
    ('M36', 'Surgery', 'Vascular Surgery STB', 'H2'),
    ('M37', 'Surgery', 'Plastic Surgery STB', 'H2'),
    ('M38', 'Surgery', 'Urology STB', 'H2'),
    ('M39', 'Mental Health/Turning Point/Alcohol&Drug', 'Adolescent IPU STB', 'H2'),
    ('M40', 'Emergency and General Medicine', 'Acute Medical B2 STB', 'H2'),
    ('M41', 'Speciality Medicine', 'Renal STB', 'H2'),
    ('M42', 'Speciality Medicine', 'Respiratory STB', 'H2'),
    ('M43', 'Speciality Medicine', 'Gastroenterology STB', 'H2'),
    ('M44', 'Emergency and General Medicine', 'Acute Medical B1 STB', 'H2'),
    ('M45', 'Surgery', 'Gen Surg C STB', 'H2'),
    ('M46', 'Surgery', 'Gen Surg B STB', 'H2'),
    ('M47', 'Speciality Medicine', 'Oncology 4.1 STB', 'H2'),
    ('M48', 'Speciality Medicine', 'Haematology STB', 'H2'),
    ('M49', 'Women & Children', 'Paediatrics STB', 'H2'),
    ('M50', 'Speciality Medicine', 'Oncology 5.1 STB', 'H2'),
    ('M51', 'Speciality Medicine', 'Stroke STB', 'H2'),
    ('M52', 'Emergency and General Medicine', 'Acute Medical B3 STB', 'H2'),
    ('M53', 'Speciality Medicine', 'Cardiology STB', 'H2');