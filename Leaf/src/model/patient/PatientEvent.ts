import { PatientEventCategory } from "./PatientEventCategory";
import UUID from "../core/UUID";

class PatientEvent {
    public readonly id: UUID;
    public readonly createdAt: Date;
    public readonly triggerTime: Date;
    public readonly title: string;
    public readonly description: string;
    public readonly category: PatientEventCategory;
    public readonly eventData: string;
    private _lastCompleted: Date;
    public get lastCompleted(): Date {
        return this._lastCompleted;
    }
    public get createdAtDescription(): string {
        const timeText = this.createdAt
            .toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
            .toUpperCase();
        const dateText = this.createdAt.toDateString();
        return `${dateText} ${timeText}`;
    }
    public get triggerTimeDescription(): string {
        const timeText = this.triggerTime
            .toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            })
            .toUpperCase();
        return timeText;
    }

    constructor(
        id: UUID,
        createdAt: Date,
        triggerTime: Date,
        title: string,
        description: string,
        category: PatientEventCategory,
        lastCompleted: Date,
        eventData: string
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.triggerTime = triggerTime;
        this.title = title;
        this.description = description;
        this.category = category;
        this._lastCompleted = lastCompleted;
        this.eventData = eventData;
    }

    public static new(
        triggerTime: Date,
        title: string,
        description: string,
        category: PatientEventCategory,
        eventData: string,
    ): PatientEvent {
        return new PatientEvent(UUID.generate(), new Date(), triggerTime, title, description, category, new Date(0), eventData);
    }

    public markCompleted() {
        this._lastCompleted = new Date();
    }

    public markIncomplete() {
        this._lastCompleted = new Date(0);
    }

    public occursAfter(time: Date): boolean {
        const minsIntoDay = this.triggerTime.getHours() * 60.0 + this.triggerTime.getMinutes();
        const other = time.getHours() * 60.0 + time.getMinutes();
        return minsIntoDay > other;
    }

    public completedToday(): boolean {
        const now = new Date();
        return (
            now.getFullYear() === this.lastCompleted.getFullYear() &&
            now.getMonth() === this.lastCompleted.getMonth() &&
            now.getDate() === this.lastCompleted.getDate()
        );
    }

    public getExportSummary(): string {
        return `ID:${this.id} TriggerTime:${this.triggerTimeDescription} Title:${this.title} Description:${this.description} Category:${this.category} LastCompleted:${this.lastCompleted}`.replace(
            /,|\n/g,
            " ",
        );
    }
}

export default PatientEvent;
