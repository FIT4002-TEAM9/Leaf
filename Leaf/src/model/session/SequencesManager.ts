import { DatabaseCollection } from "../../database/DatabaseCollection";
import DatabaseSession from "../../database/DatabaseSession";
import { strings } from "../../localisation/Strings";

class SequencesManager {
    public static readonly inst = new SequencesManager();

    private constructor() {}

    public async getSequence(sequenceNo: number): Promise<number | null> {
        const sequenceField = `sequence${sequenceNo}`;
        console.log(sequenceField);
        const dataObject = await DatabaseSession.inst.read(DatabaseCollection.Sequences, strings("sequence.documentName"));
        if (!dataObject) {
            return NaN;
        }
        const sequenceRes = dataObject.getNumberOrNull(sequenceField);
        return sequenceRes;
    }

    public async updateSequence(sequenceNo: number, value: number): Promise<boolean> {
        const sequenceField = `sequence${sequenceNo}`;
        return DatabaseSession.inst.update(DatabaseCollection.Sequences, strings("sequence.documentName"), {[sequenceField]: value});
    }
}

export default SequencesManager;