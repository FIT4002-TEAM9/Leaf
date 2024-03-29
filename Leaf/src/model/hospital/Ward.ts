class Ward {
    public readonly id: string;
    public readonly hospitalCode: string;
    public readonly name: string;

    constructor(id: string, hospitalCode: string, name: string) {
        this.id = id;
        this.hospitalCode = hospitalCode;
        this.name = name;
    }
}

export default Ward;
