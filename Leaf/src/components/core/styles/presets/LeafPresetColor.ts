import { UnreachableCaseError } from "../../../../language/errors/UnreachableCaseError";
import LeafColor from "../color/LeafColor";

export enum LeafPresetColor {
    bodyText,
    primaryButtonText,
}

export namespace LeafPresetColor {
    export function getColor(color: LeafPresetColor): string {
        switch (color) {
            case LeafPresetColor.bodyText:
                return new LeafColor("#212529", "#f8f9fa").getColor();
            case LeafPresetColor.primaryButtonText:
                return new LeafColor("#f8f9fa", "#212529").getColor();
            default:
                throw new UnreachableCaseError(color);
        }
    }
}