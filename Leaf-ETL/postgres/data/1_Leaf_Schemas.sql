CREATE TYPE SEX AS ENUM ('FEMALE', 'MALE', 'OTHER');
CREATE TYPE TRIAGE_CODE AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE EVENT_CATEGORY AS ENUM ('DRUG_EXPOSURE', 'VISIT_OCCURRENCE', 'CONDITION_OCCURRENCE', 'PROCEDURE_OCCURRENCE', 'DEVICE_EXPOSURE', 'MEASUREMENT', 'OBSERVATION', 'EPISODE', 'NOTE');

CREATE TABLE hospital (
    id VARCHAR PRIMARY KEY,
    code VARCHAR NOT NULL,
    hospital_name VARCHAR NOT NULL
);

CREATE TABLE provider (
    id VARCHAR PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    hospital_id VARCHAR NOT NULL REFERENCES hospital(id)
);

CREATE TABLE patient (
    mrn VARCHAR(12) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    post_code VARCHAR(4) NOT NULL,
    sex SEX NOT NULL,
    time_last_allocated DATE NOT NULL,
    provider_id VARCHAR REFERENCES provider(id),
    hospital_id VARCHAR REFERENCES hospital(id)
);

CREATE TABLE ward (
    id VARCHAR PRIMARY KEY,
    code VARCHAR NOT NULL,
    ward_name VARCHAR NOT NULL,
    hospital_id VARCHAR NOT NULL REFERENCES hospital(id)
);

CREATE TABLE medical_unit (
    id VARCHAR PRIMARY KEY,
    unit_group VARCHAR NOT NULL,
    unit_name VARCHAR NOT NULL,
    hospital_id VARCHAR NOT NULL REFERENCES hospital(id)
);

CREATE TABLE triage_case (
    id VARCHAR(36) PRIMARY KEY,
    triage_code TRIAGE_CODE NOT NULL,
    triage_text VARCHAR,
    patient_id VARCHAR NOT NULL REFERENCES patient(mrn),
    arrival_date DATE NOT NULL,
    discharge_date DATE,
    arrival_ward_id VARCHAR NOT NULL REFERENCES ward(id),
    discharge_ward_id VARCHAR REFERENCES ward(id),
    hospital_id VARCHAR NOT NULL REFERENCES hospital(id),
    medical_unit_id VARCHAR REFERENCES medical_unit(id)
);

CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR REFERENCES patient(mrn),
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    category EVENT_CATEGORY NOT NULL,
    created_at DATE NOT NULL,
    last_completed DATE,
    trigger_time DATE
);
