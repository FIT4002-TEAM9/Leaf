import ID from "../core/ID";
import SequencesManager from "../session/SequencesManager";

class EmployeeID extends ID {

    constructor(code: string) {
        // TODO: Validation
        super(code);
    }

    public static async generate(): Promise<EmployeeID> {
        const maxSequence = 9; 
        const sequenceNo = Math.floor(Math.random() * maxSequence) + 1;
        return new EmployeeID((await EmployeeID.incrementSequence(sequenceNo)).toString());
    }

    private static async incrementSequence(sequenceNo: number): Promise<number> {
            // Fetch the current sequence value
            const currentSequence = await SequencesManager.inst.getSequence(sequenceNo);

            if (currentSequence === null) {
                throw new Error("Failed to retrieve the sequence value from the database.");
            }
    
            // Convert and increment the value
            const incrementedSequence = currentSequence + 1;
    
            // Update the database with the incremented value
            const updateSuccess = await SequencesManager.inst.updateSequence(sequenceNo, incrementedSequence);
    
            if (!updateSuccess) {
                throw new Error("Failed to update the sequence value in the database.");
            }
    
            return incrementedSequence;
    }

    public matches(other: EmployeeID): boolean {
        return this.toString() == other.toString();
    }
}

export default EmployeeID;
